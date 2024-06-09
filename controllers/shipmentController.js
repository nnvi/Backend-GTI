const { v4: uuidv4 } = require('uuid');
const {shipment,container,shipment_detail,users, log_activity,shipment_containers}= require('../models');
const { Op } = require('sequelize');

class ShipmentController{
    //get all Shipment
    static async getShipment(req,res){
        try{
            const page = parseInt(req.query.page== undefined? 1: req.query.page)
            const pageSize = 5
            const start = (page-1)*pageSize
            const end = page*pageSize
            const search = req.query.search || '';
            const datefilter = req.query.date ?new Date(req.query.date) : null;
            console.log(datefilter);
            const whereClause = {
                active_status: true,
                [Op.or]: [
                    { number: { [Op.like]: `%${search}%` } },
                    { '$shipment_detail.shipper$': { [Op.like]: `%${search}%` } }
                ],
                ...(datefilter && { createdAt: {
                    [Op.gte]: new Date(datefilter.setHours(0, 0, 0, 0)),
                    [Op.lt]: new Date(datefilter.setHours(23, 59, 59, 999))
                } })
            };

            const countShipment = await shipment.count({
                where:whereClause,
                include: [{
                    model: shipment_detail
                }]
            })
            const totalPage = (countShipment%pageSize !=0? (Math.floor(countShipment/pageSize))+1:(Math.floor(countShipment/pageSize)))

            const getAllShipment=await shipment.findAll({
                where:whereClause,
                attributes:['id','uuid','status','number','createdAt'],
                include: [{
                    model: shipment_detail,
                    attributes:['shipper','POL','POD','ETD']
                }]
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
                ETD: shipment.shipment_detail.ETD
            }))
            const pageShipment = setresponse.slice(start,end)

            res.status(200).json({
                page: page,
                totalShipment: countShipment,
                totalPage: totalPage,
                shipment: pageShipment
            })
        }
        catch(err){
            res.status(500).json({message:err.message})
        }
    }
    
    // add a new Shipment
    static async addShipment(req,res){
        try{
            const {number, container_number, status,POL, POD, ETD, ETA, stuffing_date, shipper} = req.body
            
            const createdetails= await shipment_detail.create({POL, POD, ETD, ETA, stuffing_date, shipper})

            const cont_id =  await container.findAll({
                where:{
                    number: container_number
                },
                attributes:['id','number','status']
            })

            const checkShip = await shipment.findOne({
                where:{number: number}
            })
            if(checkShip!=null){
                throw{
                    code: 401,
                    message: "Shipment number recorded, Please enter another number"
                }
            }

            cont_id.forEach(container => { 
                if(container.status!= "Ready"){
                    throw{
                        code:401,
                        message:`container ${container.id} status ${container.status}, please choose another container`
                    }
                }                
            });

            const create = await shipment.create({
                uuid: uuidv4(),
                number: number,
                user_id: req.UserData.id,
                return_empty: null,
                status:status,
                shipment_detail_id: createdetails.id,
                remark_description: null,
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
                    status:"In-Use"
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
                message:"add shipment successfull",
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
                    container: containerNumbers,
                    shipment_uuid: shipmentInfo.uuid,
                    shipment_number: shipmentInfo.number,
                    shipment_status: shipmentInfo.status,
                    shipment_remark: shipmentInfo.remark_description,
                    POL: shipmentDetails.POL,
                    POD: shipmentDetails.POD,
                    ETD: shipmentDetails.ETD,
                    ETA: shipmentDetails.ETA,
                    shipper: shipmentDetails.shipper,
                    stuffing_date: shipmentDetails.stuffing_date
                }})
        }catch(err){
            res.status(501).json({
                message:err
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
                throw{
                    code: 401,
                    message: (getShipment==null?`${uuid} not found`:`${getShipment.number} not found`)
                }
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
                message: `delete shipment ${getShipment.number} successful`
            })

        }catch(err){
            res.status(401).json({
                message:err
            })
        }
    }

    //edit data shipment by uuid
    static async editShipment(req,res){
        try{
            const {number,container_number, status,POL, POD, ETD, ETA, stuffing_date, shipper, remark_description} = req.body
            const {uuid} = req.params
            
            const getShipment = await shipment.findOne({
                where:{uuid:uuid},
                attributes:['id','shipment_detail_id']
            })

            const updateShipmentDetails = await shipment_detail.update({
                POL,POD,ETD,ETA,stuffing_date,shipper
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
                    location: POD,
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
                remark_description: (status== "Pickup"|| status=="Accident" ? remark_description:null)
            },{
                where:{uuid:uuid},
                returning: true
            })
            
            const idPivot = getContainerUsed.map(detail => detail.id);
            const delPivotData = await shipment_containers.destroy({where:{id:idPivot}})
            const pivotData = cont_id.map(container=>({
                shipment_id:getShipment.id,
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
                status: "update Shipments successful",
                Shipment: {
                    id: editShipment[1][0].id,
                    uuid: editShipment[1][0].uuid,
                    number: editShipment[1][0].number,
                    user_id: editShipment[1][0].user_id,
                    container: cont_id.map(container=>container.id),
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
            const dashboardShipment = await shipment.findAll({
                where:{
                    active_status:true
                },
                attributes: ['id','number'],
                include:{
                    model:users,
                    attributes:['id','location']
                }
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
                message: err
            })
        }
    }
}

module.exports = ShipmentController