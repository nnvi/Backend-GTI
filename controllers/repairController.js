const { v4: uuidv4 } = require('uuid');
const { repair, container, log_activity, Sequelize } = require('../models')
const ExcelJS = require('exceljs');
const cloudinary = require('../middlewares/cloudinary')

class RepairController {
    //get all Repair
    static async getRepair(req, res) {
        try {
            const page = parseInt(req.query.page == undefined ? 1 : req.query.page)
            const search = req.query.search || ''
            const pageSize = 5
            const start = (page - 1) * pageSize
            const end = page * pageSize
            const exportData = req.query.export || false;

            const countRepair = await repair.count({
                where:{
                    '$container.number$': { [Sequelize.Op.like]: `%${search}%` }
                }
            })
            const totalPage = (countRepair % pageSize != 0 ? (Math.floor(countRepair / pageSize)) + 1 : (Math.floor(countRepair / pageSize)))

            const getAllRepair = await repair.findAll({
                where: {
                    '$container.number$': { [Sequelize.Op.like]: `%${search}%` }
                },
                attributes: ['id', 'uuid', 'remarks', 'createdAt', 'finish'],
                include: [{
                    model: container,
                    attributes: ['number', 'type', 'location', 'age']
                }, container],
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            const setresponse = getAllRepair.map(repair => ({
                id: repair.id,
                uuid: repair.uuid,
                remarks: repair.remarks,
                createdAt: repair.createdAt,
                repair: repair.finish,
                number: repair.container.number,
                type: repair.container.type,
                location: repair.container.location,
                age: repair.container.age
            }))

            if (exportData) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('repairs');

                worksheet.columns = [
                    { header: 'Container_Number', key: 'container_number', width: 15 },
                    { header: 'Container_Type', key: 'container_type', width: 15 },
                    { header: 'Container_Location', key: 'container_location', width: 15 },
                    { header: 'Container_Age', key: 'container_age', width: 10 },
                    { header: 'Remarks', key: 'remarks', width: 15 },
                    { header: 'Finish_Status', key: 'finish_status', width: 10 },
                    { header: 'CreatedAt', key: 'createdAt', width: 10 }
                ];

                getAllRepair.map((value, idx) => {
                    worksheet.addRow({
                        remarks: value.remarks,
                        container_number: value.container.number,
                        container_type: value.container.type,
                        container_location: value.container.location,
                        container_age: value.container.age,
                        finish_status: value.finish? "Finished":"On Progress",
                        createdAt: value.createdAt
                    })
                })
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=repairs.xlsx');
                await workbook.xlsx.write(res);
                res.end();
            } else {
                const pageRepair = setresponse.slice(start, end)

                res.status(200).json({
                    page: page,
                    totalRepair: countRepair,
                    totalPage: totalPage,
                    repairs: pageRepair
                })
            }
        }
        catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    // add a new Repair
    static async addRepair(req, res) {
        try {
            const { number, remarks } = req.body
            const cont_id = await container.findOne({
                where: {
                    number: number
                },
            })
            if (!cont_id) {
                return res.status(500).json({
                    code: 500,
                    message: "Container not found"
                })
            }

            if (cont_id.status == "Repair") {
                return res.status(400).json({ Pesan: 'Kontainer sudah dalam perbaikan' });
            } else if (cont_id.status == "In-Use") {
                return res.status(400).json({ Pesan: 'Kontainer sedang digunakan dalam pengiriman' });
            }
            let result = {}
            if (req.file != null || req.file != undefined) {
                result = await cloudinary.uploader.upload(req.file.path, { folder: "repair_picture" }, function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            status: "failed upload pictures",
                            message: err
                        })
                    }
                    return result
                });
            } else {
                result = null
            }
            const create = await repair.create({
                uuid: uuidv4(),
                user_id: req.UserData.id,
                container_id: cont_id.id,
                remarks: remarks,
                image: (result == null ? result : result.secure_url),
                finish: false
            })
            const updateCont = await container.update({
                status: "Repair"
            }, {
                where: {
                    id: cont_id.id
                }
            })
            const addRepairLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: `Added New Repairment ${number}`
            })
            res.status(201).json({
                meesage: `Successfully add repair ${number} !`,
                repair: create
            })
        } catch (err) {
            res.status(500).json({
                message: err.message,

            })
        }
    }

    //get Repair by id
    static async getRepairbyUuid(req, res) {
        try {
            const { uuid } = req.params
            const getrepairId = await repair.findOne({
                where: {
                    uuid: uuid
                },
                attributes: ['id', 'uuid', 'remarks', 'createdAt', 'image', 'finish'],
                include: [{
                    model: container,
                    attributes: ['uuid', 'number', 'age', 'location', 'type']
                }]
            })
            if (!getrepairId) {
                return res.status(404).json({
                    message: "Repair not found"
                });
            }
            const setresponse = {
                id: getrepairId.id,
                uuid: getrepairId.uuid,
                remarks: getrepairId.remarks,
                image: getrepairId.image,
                createdAt: getrepairId.createdAt,
                finish: getrepairId.finish,
                container_uuid: getrepairId.container.uuid,
                number: getrepairId.container.number,
                type: getrepairId.container.type,
                location: getrepairId.container.location,
                age: getrepairId.container.age
            }
            res.status(200).json({
                repair: setresponse
            })
        } catch (err) {
            res.status(501).json({
                message: err.message
            })
        }
    }

    //delete Repair by id
    static async deleteRepair(req, res) {
        try {
            const { uuid } = req.params;
            const getRepair = await repair.findOne({
                where: {
                    uuid: uuid,
                },
                attributes: { only: ['image', 'id', 'container_id'] },
                include: [{
                    model: container,
                    attributes: ['number']
                }]
            });

            if (!getRepair) {
                return res.status(404).json({
                    message: "Repair not found"
                });
            }

            if (getRepair.image != null) {
                const imageName = `repair_picture/${getRepair.image.split('/').pop().split('.')[0]}`;
                await cloudinary.uploader.destroy(imageName, function (err, result) {
                    if (err) {
                        return res.status(500).json({
                            message: "failed to delete old picture"
                        });
                    }
                });
            }
            const updateContainer = await container.update({
                status: "Ready"
            }, {
                where: {
                    id: getRepair.container_id
                },
                returning: true
            })

            const addRepairLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: getRepair.id,
                activity_info: `Deleted a Repairment ${getRepair.id}`
            })

            const deleteRepair = await repair.destroy({
                where: {
                    uuid: uuid,
                },
            });

            res.status(200).json({
                message: `Repair deleted Successfully !`,
            });
        } catch (err) {
            res.status(401).json({
                message: err.message,
            });
        }
    }

    static async EditRepair(req, res) {
        try {
            const { number, remarks } = req.body
            const { uuid } = req.params
            const getRepair = await repair.findOne({
                where: {
                    uuid: uuid,
                },
                attributes: { only: ['image', 'container_id'] },
            });
            if (!getRepair) {
                return res.status(404).json({
                    message: "Repair not found"
                });
            }

            let result = {};
            if (req.file) {
                if (getRepair.image) {
                    const imageName = `repair_picture/${getRepair.image.split('/').pop().split('.')[0]}`;
                    await cloudinary.uploader.destroy(imageName, function (err, result) {
                        if (err) {
                            return res.status(500).json({
                                message: "failed to delete old picture"
                            });
                        }
                    });
                }
                result = await cloudinary.uploader.upload(req.file.path, { folder: "repair_picture" }, function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            status: "failed upload picture",
                            message: err
                        });
                    }
                    return result;
                });
            } else {
                result = null;
            }
            const cont_id = await container.findOne({
                where: {
                    number: number
                },
                attributes: ['id', 'number']
            })

            if (cont_id.id != getRepair.container_id) {
                const updateContStatus = await container.update({
                    status: "Ready"
                }, {
                    where: {
                        id: getRepair.container_id
                    }
                })
                const cont_id = await container.findOne({
                    where: {
                        number: number
                    }
                })
                if (cont_id.status != "Ready") {
                    return res.status(401).json({
                        message: `container ${number} status ${cont_id.status}, please choose another container`
                    })
                }
            }
            const updateCont = await container.update({
                status: "Repair"
            }, {
                where: {
                    number: number
                }
            })

            const editRepair = await repair.update({
                container_id: cont_id.id,
                remarks: remarks,
                image: result ? result.secure_url : getRepair.image
            }, {
                where: { uuid: uuid },
                returning: true
            })
            const editRepairLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: getRepair.id,
                activity_info: `edit repair container ${editRepair[1][0].id}`
            })
            res.status(200).json({
                message: `Repair updated Successfully !`,
                repair: {
                    number: cont_id.number,
                    remarks: editRepair[1][0].remarks,
                    image: editRepair[1][0].image
                }
            })
        } catch (err) {
            res.status(402).json({
                message: err.message
            })
        }
    }

    static async FinishRepair(req, res) {
        try {
            const { uuid } = req.params
            const getRepair = await repair.findOne({
                where: {
                    uuid: uuid,
                },
                attributes: ['container_id'],
            });
            if (!getRepair) {
                return res.status(404).json({
                    message: "Repair not found"
                });
            }
            const finishRepair = await repair.update({
                finish: true
            }, {
                where: {
                    uuid: uuid
                }
            })
            const updateContainer = await container.update({
                status: "Ready"
            }, {
                where: {
                    id: getRepair.container_id
                },
                returning: true
            })
            const finishRepairLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: getRepair.id,
                activity_info: `Repairment ${updateContainer[1][0].number} finished`
            })
            res.status(200).json({
                message: `Repair container finished !`
            })
        } catch (err) {
            res.status(501).json({
                message: err.message
            })
        }
    }

    static async historyRepair(req, res) {
        try {
            const { uuid } = req.params
            const getRepair = await repair.findOne({
                where: { uuid: uuid },
                attributes: ['container_id'],
                include: {
                    model: container,
                    attributes: ['number']
                }
            })
            if (!getRepair) {
                return res.status(404).json({
                    message: "Repair not found"
                });
            }
            const getHistoryRepair = await repair.findAll({
                where: {
                    container_id: getRepair.container_id
                },
                attributes: ['id', 'remarks', 'createdAt'],
                include: [{
                    model: container,
                    attributes: ['number']
                }]
            })
            const setresponse = getHistoryRepair.map(history => ({
                id: history.id,
                remarks: history.remarks,
                container_number: history.container.number,
                createdAt: history.createdAt
            }))
            res.status(200).json({
                history: setresponse
            })
        } catch (err) {
            res.status(501).json({
                message: err.message
            })
        }
    }
}

module.exports = RepairController
