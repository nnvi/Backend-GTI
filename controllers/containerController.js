const { v4: uuidv4 } = require('uuid');
const {container,users,log_activity,shipment,shipment_containers,shipment_detail, Sequelize}= require('../models');
const ExcelJS = require('exceljs');

class containerController{
    //get all container
    static async getContainer(req,res){
        try{
            const page = parseInt(req.query.page== undefined? 1: req.query.page)
            const pageSize = 5
            const start = (page-1)*pageSize
            const end = page*pageSize
            const search = req.query.search || ''
            const filterStatus = req.query.status || ''
            const filterlocation = req.query.location || ''
            const exportData = req.query.export || false;

            const whereClause = {
                status: {
                    [Sequelize.Op.ne]: 'Repair' 
                },
                ...(search && { number: { [Sequelize.Op.like]: `%${search}%` } }),
                ...(filterStatus && { status: filterStatus }),
                ...(filterlocation && { location: { [Sequelize.Op.like]: `%${filterlocation}%` } })
            };

            const countCont = await container.count({
                where:whereClause
            })
            const totalPage = (countCont%pageSize !=0? (Math.floor(countCont/pageSize))+1:(Math.floor(countCont/pageSize)))

            const getAllContainer=await container.findAll({
                attributes:{exclude:['user_id','createdAt','updatedAt']},
                where: whereClause,
                order: [
                    ['number', 'ASC']
                ]
            })

            if (exportData) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('containers');
    
                worksheet.columns = [
                    { header: 'Number', key: 'number', width: 20 },
                    { header: 'Type', key: 'type', width: 15 },
                    { header: 'Location', key: 'location', width: 15 },
                    { header: 'Age', key: 'age', width: 10 },
                    { header: 'Status', key: 'status', width: 15 }
                ];

                getAllContainer.map((value,idx)=>{
                    worksheet.addRow({
                        number: value.number,
                        age: value.age,
                        location: value.location,
                        iddle_days: value.iddle_days,
                        type: value.type,
                        status: value.status,
                    })
                })
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=containers.xlsx');
                await workbook.xlsx.write(res);
                res.end();
            } else {
                const pageContainer = getAllContainer.slice(start,end)
                res.status(200).json({
                    page: page,
                    totalContainer: countCont,
                    totalPage: totalPage,
                    containers: pageContainer
                })
            }
        }
        catch(err){
            res.status(500).json({message:err.message})
        }
    }

    // add a new container
    static async addContainer(req,res){
        try{
            const {number, age, location, iddle_days, type} = req.body

            c

            if(location==null || location==""){
                return res.status(400).json({
                    message:"Please enter location!"
                })
            }
            const checkCont = await container.findOne({
                where:{number: number}
            })
            if(checkCont!=null){
                return res.status(401).json({
                    code: 401,
                    message: "Container number recorded, Please enter another number"
                })
            }
            const create = await container.create({
                uuid: uuidv4(),
                number: number,
                user_id: req.UserData.id,
                age: age,
                location: location,
                iddle_days:iddle_days,
                type: type,
                status: "Ready"
            })

            const addContainerLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: `Added New Container ${create.number}`
            })

            res.status(201).json({
                message: `Successfully add container ${create.number} !`,
                container: {
                    id: create.id,
                    uuid: create.uuid,
                    number: create.number,
                    user_id: create.user_id,
                    age: create.age,
                    location: create.location,
                    iddle_days: create.iddle_days,
                    type: create.type,
                    status: create.status
                }
            })
        }catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }

    //get container by uuid
    static async getContainerbyUuid(req,res){
        try{
            const {uuid} = req.params
            const getcontainerId = await container.findOne({
                where:{
                    uuid: uuid
                },
                attributes:{
                    exclude:['createdAt','updatedAt','user_id']
                }
            })
            var getShipmentData = null
            if(getcontainerId.status=="In-Use"){
                const getshipment = await shipment_containers.findAll({
                    where:{
                        container_id: getcontainerId.id
                    },
                    attributes:['id'],
                    include:{
                        model: shipment,
                        attributes:['number','status'],
                        where: {
                            status: {
                                [Sequelize.Op.ne]: 'Return' 
                            },
                            active_status:{
                                [Sequelize.Op.ne]: false 
                            }
                        },
                        include:[{
                            model:shipment_detail,
                            attributes:['shipper']
                        }]
                    }
                })
                getShipmentData = getshipment.map(data=>({
                    shipment_number: data.shipment.number,
                    shipper:data.shipment.shipment_detail.shipper
                }))
            }

            const setResponse = {
                id: getcontainerId.id,
                uuid: getcontainerId.uuid,
                number: getcontainerId.number,
                age: getcontainerId.age,
                location: getcontainerId.location,
                iddle_days: getcontainerId.iddle_days,
                type: getcontainerId.type,
                status: getcontainerId.status,
                shipment_number: (!getShipmentData?null: getShipmentData[0].shipment_number),
                shipper: (!getShipmentData?null: getShipmentData[0].shipper)
                }
            res.status(200).json({
                container:setResponse
            })
        }catch(err){
            res.status(501).json({
                message:err.message
            })
        }
    }

    //delete container by uuid
    static async deleteContainer(req,res){
        try{
            const {uuid}= req.params
            const getCont = await container.findOne({where:{uuid:uuid},attributes:['number','status']})
            if(getCont.status != "Ready"){
                return res.status(401).json({
                    code: 401,
                    message:`Container currently ${getCont.status}, Can't Delete this data`
                })
            }
            const deletecontainer = await container.destroy({where:{uuid:uuid}})
            const delContainerLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: `Deleted Container ${getCont.number}`
            })
            res.status(200).json({
                message: `Container deleted successfully !`
            })

        }catch(err){
            res.status(401).json({
                message:err.message
            })
        }
    }

    //edit container data by uuid
    static async editContainer(req,res){
        try{
            const {number, age, location, iddle_days, type} = req.body
            const {uuid} = req.params

            if(age<0){
                return res.status(400).json({
                    message: "Age should be at or above 0!"
                })
            }else if(iddle_days<0){
                return res.status(400).json({
                    message: "Iddle days should be at or above 0!"
                })
            }
            
            if(location==null|| location==""){
                return res.status(400).json({
                    message:"Please enter location!"
                })
            }
            const editcontainer = await container.update({
                number: number,
                age: age,
                user_id: req.UserData.id,
                location: location,
                iddle_days: iddle_days,
                type: type
            },{
                where:{uuid: uuid},
                returning: true
            })
            
            const EditContLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: `Edited container data ${editcontainer[1][0].number}`
            })

            res.status(200).json({
                message: `Container updated successfully`,
                container: {
                    id: editcontainer[1][0].id,
                    uuid : editcontainer[1][0].uuid,
                    number: editcontainer[1][0].number,
                    age: editcontainer[1][0].age,
                    location: editcontainer[1][0].location,
                    iddle_days: editcontainer[1][0].iddle_days,
                    type: editcontainer[1][0].type
                }
            })
        }catch(err){
            res.status(402).json({
                message:err.message
            })
        }
    }

    //get all container with status ready
    static async ContainerReady(req,res){
        try{
            const ready = await container.findAll({
                where:{
                    status: "Ready"
                },
                attributes:['number','age','location','type']
            })
            res.status(200).json({
                container: ready
            })
        }catch(err){
            res.status(500).json({
                message:err.message
            })
        }
    }

    //get data for dashboard statistic
    static async getContainerByStatus(req,res){
        try{
            const ReadyCont = await container.count({
                where:{
                    status:'Ready'
                }
            })
            const InUseCont = await container.count({
                where:{
                    status:'In-Use'
                }
            })
            const RepairCont = await container.count({
                where:{
                    status:'Repair'
                }
            })
            res.status(200).json({
                message: "Statistik Status Container",
                data: {
                    Ready:ReadyCont,
                    InUse:InUseCont,
                    Repair:RepairCont
                }
            })
        }catch(err){
            res.status(500).json({
                message:err.message
            })
        }
    }

    static async historyContainer(req,res){
        try{
            const {uuid}= req.params
            const cont_id = await container.findOne({
                where: {uuid: uuid},
                attributes:['id','number']
            })
            const getHistory = await shipment_containers.findAll({
                where: {container_id: cont_id.id},
                attributes:['id'],
                include:{
                    model: shipment,
                    attributes:['number'],
                    include:[{
                        model:shipment_detail,
                        attributes:['shipper','ETD']
                    }]
                }
            })

            const responseHistory =getHistory.map(history=>({
                id:history.id,
                shipment_number: history.shipment.number,
                shipper:history.shipment.shipment_detail.shipper,
                ETD:history.shipment.shipment_detail.ETD
            }))
            res.status(200).json({
                history: responseHistory
            })
        }catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }

    static async getLocationContainer(req,res){
        try {
            const getLocation = await container.findAll({
                attributes:['location']
            });
            const location = getLocation.map(item=>item.location)
            res.status(200).json({
                location: [...new Set(location)]
            });
        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    }
}

module.exports = containerController