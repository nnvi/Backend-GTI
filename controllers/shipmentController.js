const { v4: uuidv4 } = require('uuid');
const {shipment,container,shipment_detail,users, log_activity,shipment_containers, vendor}= require('../models');
const { Op, where } = require('sequelize');
const ExcelJS = require('exceljs');
const { log } = require('sharp/lib/libvips');

class ShipmentController{
    //get all Shipment
    static async getShipment(req,res){
        try{
            const page = parseInt(req.query.page== undefined? 1: req.query.page)
            const pageSize = 5
            const start = (page-1)*pageSize
            const end = page*pageSize
            let search = req.query.search || '';
            const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
            const endDate = req.query.endDate ? new Date(`${req.query.endDate}T23:59:59.999`) : null;
            const exportData = req.query.export || false;
            search = search.toUpperCase()

            const getUser = await users.findOne({
                where:{id:req.UserData.id},
                attributes:['location']
            })
            if (startDate) {
                startDate.setHours(startDate.getHours() - 7);
            }
            if (endDate) {
                endDate.setHours(endDate.getHours() - 7);
            }

            const whereClause = {
                active_status: true,
                [Op.or]: [
                    { number: { [Op.like]: `%${search}%` } },
                    { '$shipment_detail.shipper$': { [Op.like]: `%${search}%` } }
                ],
                '$user.location$': getUser.location,
                ...(startDate && endDate && { '$shipment_detail.ETD$': { [Op.between]: [startDate, endDate] } }),
                ...(startDate && !endDate && { '$shipment_detail.ETD$': { [Op.gte]: startDate } }),
                ...(!startDate && endDate && { '$shipment_detail.ETD$': { [Op.lte]: endDate } })
            };

            const countShipment = await shipment.count({
                where:whereClause,
                include: [shipment_detail,users]
            })
            const totalPage = (countShipment%pageSize !=0? (Math.floor(countShipment/pageSize))+1:(Math.floor(countShipment/pageSize)))

            const getAllShipment=await shipment.findAll({
                where:whereClause,
                attributes:['id','uuid','status','number','createdAt','remark_description'],
                include: [{
                    model: shipment_detail,
                    attributes:['shipper','POL','POD','ETD','ETA']
                },{
                    model:users,
                    attributes:['location']
                }],
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            
            const setresponse = getAllShipment.map(shipment=>({
                id: shipment.id,
                uuid: shipment.uuid,
                status: shipment.status,
                number: shipment.number,
                createdAt: shipment.createdAt,
                shipper: shipment.shipment_detail.shipper,
                POL: shipment.shipment_detail.POL,
                POD: shipment.shipment_detail.POD,
                ETD: shipment.shipment_detail.ETD,
                ETA: shipment.shipment_detail.ETA,
                remark_description: shipment.remark_description
            }))

            if (exportData) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Shipments');
    
                worksheet.columns = [
                    { header: 'Number', key: 'number', width: 20 },
                    { header: 'Shipper', key: 'shipper', width: 15 },
                    { header: 'POL', key: 'POL', width: 15 },
                    { header: 'POD', key: 'POD', width: 15 },
                    { header: 'ETD', key: 'ETD', width: 15 },
                    { header: 'ETA', key: 'ETA', width: 15 },
                    { header: 'Status', key: 'status', width: 15 },
                    { header: 'Remark', key: 'remark_description', width: 15 },
                    { header: 'CreatedAt', key: 'createdAt', width: 10 }
                ];

                getAllShipment.map((shipment,idx)=>{
                    worksheet.addRow({
                        number: shipment.number,
                        status: shipment.status,
                        createdAt: shipment.createdAt,
                        shipper: shipment.shipment_detail.shipper,
                        POL: shipment.shipment_detail.POL,
                        POD: shipment.shipment_detail.POD,
                        ETD: shipment.shipment_detail.ETD,
                        ETA: shipment.shipment_detail.ETA,
                        remark_description: shipment.remark_description
                    })
                })
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=shipments.xlsx');
                await workbook.xlsx.write(res);
                res.end();
            } else {
                const pageShipment = setresponse.slice(start,end)

                res.status(200).json({
                    page: page,
                    totalShipment: countShipment,
                    totalPage: totalPage,
                    shipment: pageShipment
                })
            }
        }
        catch(err){
            res.status(500).json({message:err.message})
        }
    }
    
    // add a new Shipment
    static async addShipment(req,res){
        try{
            const {number, container_number, status,POL, POD, ETD, ETA, stuffing_date, shipper,remark_description} = req.body
            
            const today = new Date()
            const pad = (number) => number.toString().padStart(2, '0');
            const gettoday = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`
            const cont_id =  await container.findAll({
                where:{
                    number: container_number
                },
                attributes:['id','number','status','location']
            })

            if (cont_id.length !== container_number.length) {
                return res.status(400).json ({
                    code: 400,
                    message: "One or more container numbers are not found in the database."
                });
            }else if (stuffing_date < gettoday){
                return res.status(500).json({
                    message:`Stuffing date should be today or above!`
                })
            }else if (stuffing_date > ETD){
                return res.status(500).json({
                    message:`Stuffing date must same or below ETD Date !`
                })
            }else if (ETA < ETD){
                return res.status(500).json({
                    message:`ETA date must same or above ETD Date !`
                })
            }else if(status=="Pickup" && remark_description==null){
                return res.status(400).json({
                    message:"Missing remark data !"
                })
            }else if(POL == POD){
                return res.status(400).json({
                    message:"POL & POD cannot be same!"
                })
            }

            const checkShip = await shipment.findOne({
                where:{number: number}
            })
            if(checkShip!=null){
                return res.status(401).json({
                    code: 401,
                    message: "Shipment number recorded, Please enter another number"
                })
            }
            
            cont_id.forEach(container => { 
                if(container.status!= "Ready"){
                    return res.status(401).json({
                        code:401,
                        message:`container ${container.number} status ${container.status}, please choose another container`
                    })
                }                
            });
            
            const createdetails= await shipment_detail.create({
                POL: POL.toUpperCase(),
                POD: POD.toUpperCase(),
                ETD: ETD,
                ETA: ETA,
                stuffing_date: stuffing_date,
                shipper: shipper.toUpperCase()
            })

            const create = await shipment.create({
                uuid: uuidv4(),
                number: number,
                user_id: req.UserData.id,
                return_empty: null,
                status:status,
                shipment_detail_id: createdetails.id,
                remark_description: remark_description.toUpperCase(),
                active_status: true,
                delete_by: null
            })
            const pivotData = cont_id.map(container=>({
                shipment_id:create.id,
                container_id: container.id
            }))
            const addPivotShip = await shipment_containers.bulkCreate(pivotData)
            
            cont_id.forEach(async container=>{
                const updateCont =await container.update({
                    status:"In-Use",
                    iddle_days: 0
                },{
                    where:{
                        id:container.id
                    }
                })
            })
            const addShipmentLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: create.id,
                repair_id: null,
                activity_info: `Added Shipment ${create.number}`
            })
            res.status(201).json({
                message:`Successfully add shipment ${create.number} !`,
                Shipment: {
                    id: create.id,
                    uuid: create.uuid,
                    number: create.number,
                    user_id: create.user_id,
                    container: cont_id.map(container=>container.id),
                    return_empty: create.return_empty,
                    status: create.status,
                    shipment_detail_id: create.createdetails_id,
                    remark_description: create.remark_description,
                    active_status: create.active_status,
                    delete_by: create.delete_by
                }
            })
        }catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }

    //get Shipment by uuid
    static async getShipmentbyUuid(req,res){
        try{
            const {uuid} = req.params
            const getShipmentId = await shipment.findOne({
                where:{
                    uuid:uuid
                },
                attributes:['id'],
            })
            const getshipmentdetail= await shipment_containers.findAll({
                where:{
                    shipment_id: getShipmentId.id
                },
                attributes:['id'],
                include:[{
                    model:container,
                    attributes:['number']
                },{
                    model:shipment,
                    attributes:['uuid','number','status','remark_description'],
                    include:[{
                        model: shipment_detail,
                        attributes:['POL','POD','ETD','ETA','shipper','stuffing_date']
                    }]
                }]
            })
            const shipmentInfo = getshipmentdetail[0].shipment;
            const shipmentDetails = shipmentInfo.shipment_detail;
            const containerNumbers = getshipmentdetail.map(detail => detail.container.number);

            res.status(200).json({
                shipment:{
                    container_number: containerNumbers,
                    uuid: shipmentInfo.uuid,
                    number: shipmentInfo.number,
                    status: shipmentInfo.status,
                    remark_description: shipmentInfo.remark_description,
                    POL: shipmentDetails.POL,
                    POD: shipmentDetails.POD,
                    ETD: shipmentDetails.ETD,
                    ETA: shipmentDetails.ETA,
                    shipper: shipmentDetails.shipper,
                    stuffing_date: shipmentDetails.stuffing_date
                }
            })
        }catch(err){
            res.status(501).json({
                message:err.message
            })
        }
    }

    //delete Shipment by uuid
    static async deleteShipment(req,res){
        try{
            const {uuid}= req.params
            const getShipment = await shipment.findOne({
                where:{uuid:uuid},
                attributes:['number','id','active_status']
            })
            if(getShipment ==null || getShipment.active_status==false){
                return res.status(401).json({
                    code: 401,
                    message: (getShipment==null?`${uuid} not found`:`${getShipment.number} not found`)
                })
            }

            const getDataContainer = await shipment_containers.findAll({
                where: {
                    shipment_id:getShipment.id
                },
                attributes:['id'],
                include:[{
                    model:container,
                    attributes:['id']
                }]
            })
            const containerNumbers = getDataContainer.map(detail => detail.container.id);
            const updateContainer = await container.update({
                status:"Ready"
            },{
                where:{
                    id:containerNumbers
                },
                returning:true
            })

            const deleteShipment = await shipment.update({
                active_status: false,
                delete_by: req.UserData.email
            },
                {where:{uuid:uuid}
            })
            const addShipmentLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: getShipment.id,
                repair_id: null,
                activity_info: `delete shipment ${getShipment.number}`
            })
            
            res.status(200).json({
                message: `Shipment deleted successfully !`
            })

        }catch(err){
            res.status(500).json({
                message:err.message
            })
        }
    }

    //edit data shipment by uuid
    static async editShipment(req,res){
        try{
            const {number,container_number, status,POL, POD, ETD, ETA, stuffing_date, shipper, remark_description} = req.body
            const {uuid} = req.params
            
            if(status=="Pickup" || status=="Accident"){
                if(remark_description == null ||remark_description == ""){
                    return res.status(400).json({
                        message:"Missing remark data !"
                    })   
                }
            }else if (stuffing_date > ETD){
                return res.status(500).json({
                    message:`Stuffing date must same or below ETD Date !`
                })
            }else if (ETA < ETD){
                return res.status(500).json({
                    message:`ETA date must same or above ETD Date !`
                })
            }
            
            if(POL === POD){
                console.log(POL, POD, POL==POD);
                return res.status(400).json({
                    message:"POL & POD cannot be same!"
                })
            }

            const getShipment = await shipment.findOne({
                where:{uuid:uuid},
                attributes:['id','shipment_detail_id']
            })

            const updateShipmentDetails = await shipment_detail.update({
                POL: POL.toUpperCase(),
                POD: POD.toUpperCase(),
                ETD: ETD,
                ETA: ETA,
                stuffing_date: stuffing_date,
                shipper: shipper.toUpperCase()
            },{
                where:{
                    id: getShipment.shipment_detail_id
                },
                attributes:['id'],
                returning: true
            })
            const cont_id =  await container.findAll({
                where:{
                    number: container_number
                },
                attributes:['id']
            })
            
            const getContainerUsed = await shipment_containers.findAll({
                where:{
                    shipment_id: getShipment.id
                },
                attributes:['id','container_id'],
            })
            const containerNumbers = getContainerUsed.map(detail => detail.container_id);
            const containers = cont_id.map(cont=>cont.id)
            const containerMatch = containerNumbers.filter(num => !containers.includes(num));
            const checkNewContStatus = containers.filter(num => !containerNumbers.includes(num));            
            if(containerMatch.length!==0){
                const updateContStatus = await container.update({
                    status: "Ready"
                },{
                    where:{
                        id: containerMatch
                    }
                })
                const updatestatusNewcont = await container.update({
                    status: "In-Use"
                },{
                    where:{
                        id: checkNewContStatus
                    }
                })
                const cont_id =  await container.findAll({
                    where:{
                        id: checkNewContStatus
                    },
                    attributes:['number','status']
                })
            }

            if(status=="Return"){
                const updateContainer = await container.update({
                    location: POD.toUpperCase(),
                    iddle_days: 0,
                    status:"Ready"
                },{
                    where:{
                        number:container_number
                    }
                })
            }
            const editShipment = await shipment.update({
                number: number,
                return_empty: (status=="Return"? new Date():null),
                status:status,
                remark_description: (status== "Pickup"|| status=="Accident" ? remark_description.toUpperCase():null)
            },{
                where:{uuid:uuid},
                returning: true
            })
            
            const idPivot = getContainerUsed.map(detail => detail.id);
            const delPivotData = await shipment_containers.destroy({where:{id:idPivot}})
            const pivotData = cont_id.map(container=>({
                shipment_id: getShipment.id,
                container_id: container.id
            }))
            const addPivotShip = await shipment_containers.bulkCreate(pivotData)

            const editShipmentLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: editShipment[1][0].id,
                repair_id: null,
                activity_info: `Updated Shipment ${editShipment[1][0].number}`
            })
            res.status(200).json({
                message: `Shipment updated successfully !`,
                Shipment: {
                    id: editShipment[1][0].id,
                    uuid: editShipment[1][0].uuid,
                    number: editShipment[1][0].number,
                    user_id: editShipment[1][0].user_id,
                    container_number: cont_id.map(container=>container.id),
                    return_empty: editShipment[1][0].return_empty,
                    status: editShipment[1][0].status,
                    shipment_detail_id: editShipment[1][0].createdetails_id,
                    remark_description: editShipment[1][0].remark_description,
                    active_status: editShipment[1][0].active_status,
                    delete_by: editShipment[1][0].delete_by
                }
            })
        }catch(err){
            res.status(402).json({
                message:err.message
            })
        }
    }

    static async getShipmentDashboard(req,res){
        try{
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const dashboardShipment = await shipment.findAll({
                where:{
                    active_status:true,
                    '$shipment_detail.ETD$': {
                        [Op.between]: [startDate, endDate]
                    }
                },
                attributes: ['id','number'],
                include:[{
                    model:users,
                    attributes:['id','location']
                },
                {
                    model:shipment_detail,
                    attributes:['ETD']
                }
            ]
            })
            function ShipmentsByLocation(data, location) {
                return data.filter(item => item.user.location === location).length;
            }
            const ShipmentJakarta = ShipmentsByLocation(dashboardShipment,"Jakarta")
            const ShipmentMedan = ShipmentsByLocation(dashboardShipment,"Medan")
            const ShipmentSurabaya = ShipmentsByLocation(dashboardShipment,"Surabaya")
            const ShipmentMakassar = ShipmentsByLocation(dashboardShipment,"Makassar")
            res.status(200).json({
                message : "Statistik Total Shipment per Cabang",
                data : {
                    Medan: ShipmentMedan,
                    Jakarta: ShipmentJakarta,
                    Makassar: ShipmentMakassar,
                    Surabaya: ShipmentSurabaya
                }
            })
        }catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }

    //Get vendor
    static async getVendor(req,res){
        try{
            let {TMSbook,SPILbook,MRTbook,TNTbook} = ""
            const today = new Date()
            const pad = (number) => number.toString().padStart(2, '0');
            const getnumber = `${today.getFullYear().toString().slice(-2)}${pad(today.getMonth()+1)}`

            const getVendor = await vendor.findAll({
                attributes:['name','book_code']
            })

            //Set tanto book number
            const getTanto =await shipment.findAll({
                where:{
                    number:{ [Op.like]: `%TNT${getnumber}%` } 
                },attributes:['number'],
                order:[['number','DESC']]
            })
            const tanto = getTanto==''?0:getTanto[0].number.split(/(?<=\D)(?=\d)|(?<=\d)(?=\D)/)
            TNTbook = tanto ==0?`TNT${getnumber}001`:`${tanto[0]}${parseInt(tanto[1])+1}`

            //Set Spil book number
            const getSPIL =await shipment.findAll({
                where:{
                    number:{ [Op.like]: `%SPIL${getnumber}%` } 
                },attributes:['number'],
                order:[['number','DESC']]
            })
            const spil = getSPIL==''?0:getSPIL[0].number.split(/(?<=\D)(?=\d)|(?<=\d)(?=\D)/)
            SPILbook = spil==0?`SPIL${getnumber}001`:`${spil[0]}${parseInt(spil[1])+1}`

            //Set Meratus book number
            const getMRT =await shipment.findAll({
                where:{
                    number:{ [Op.like]: `%MRT${getnumber}%` } 
                },attributes:['number'],
                order:[['number','DESC']]
            })
            const meratus = getMRT==''?0:getMRT[0].number.split(/(?<=\D)(?=\d)|(?<=\d)(?=\D)/)
            MRTbook = meratus==0?`MRT${getnumber}001`:`${meratus[0]}${parseInt(meratus[1])+1}`

            //Set Temas book number
            const getTMS =await shipment.findAll({
                where:{
                    number:{ [Op.like]: `%TMS${getnumber}%` } 
                },attributes:['number'],
                order:[['number','DESC']]
            })
            const temas = getTMS==''?0:getTMS[0].number.split(/(?<=\D)(?=\d)|(?<=\d)(?=\D)/)
            TMSbook = temas==0?`TMS${getnumber}001`:`${temas[0]}${parseInt(meratus[1])+1}`
            const result = getVendor.map((vendor) => ({
                ...vendor.get(),
                book_num: vendor.name =="TANTO"?TNTbook:vendor.name =="SPIL"?SPILbook:vendor.name =="MERATUS"?MRTbook:TMSbook
            }));
            
            res.status(200).json({
                vendors:result
            })
        }catch(err){
            res.status(500).json({
                message: err.message
            })
        }
    }
}

module.exports = ShipmentController
