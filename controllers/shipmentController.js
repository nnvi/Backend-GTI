const { v4: uuidv4 } = require('uuid');
const {shipment,container,shipment_detail,users, log_activity}= require('../models');
const { Op, where } = require('sequelize');

class ShipmentController{
    //get all Shipment
    static async getShipment(req,res){
        try{
            const page = parseInt(req.query.page== undefined? 1: req.query.page)
            const pageSize = 5
            const start = (page-1)*pageSize
            const end = page*pageSize

            const countShipment = await shipment.count({
                where:{
                    active_status: true
                }
            })
            const totalPage = (countShipment%pageSize !=0? (Math.floor(countShipment/pageSize))+1:(Math.floor(countShipment/pageSize)))

            const getAllShipment=await shipment.findAll({
                where:{
                    active_status:true
                },
                attributes:['id','uuid','status'],
                include: [{
                    model: shipment_detail,
                    attributes:['shipper','POL','POD','ETD']
                }]
            })
            const pageShipment = getAllShipment.slice(start,end)

            res.status(200).json({
                page: page,
                totalShipment: countShipment,
                totalPage: totalPage,
                shipment: pageShipment
            })
        }
        catch(err){
            res.status(500).json({message:err})
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
                }
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

            if(cont_id[0].status!= "Ready"){
                throw{
                    code:401,
                    message:`container ${container_number} status ${cont_id[0].status}, please choose another container`
                }
            }
            const create = await shipment.create({
                uuid: uuidv4(),
                number: number,
                user_id: req.UserData.id,
                container_id: cont_id[0].id,
                return_empty: null,
                status:status,
                shipment_detail_id: createdetails.id,
                remark_description: null,
                active_status: true,
                delete_by: null
            })

            const updateCont =await container.update({
                status:"In-Use"
            },{
                where:{
                    id:cont_id[0].id
                }
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
                    container_id: create.container_id,
                    return_empty: create.return_empty,
                    status: create.status,
                    shipment_detail_id: create.createdetails_id,
                    remark_description: create.remark_description,
                    image: create.image,
                    active_status: create.active_status,
                    delete_by: create.delete_by
                }
            })
        }catch(err){
            res.status(500).json({
                message: err
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
                attributes:['uuid','number','status','active_status','delete_by'],
                include: [{
                    model: users,
                    attributes:['name']
                },{
                    model: container,
                    attributes:['number']
                },
                {
                    model: shipment_detail,
                    attributes:{exclude:['updatedAt','createdAt']}
                }]
            })
            res.status(200).json({shipment:getShipmentId})
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
                attributes:['number','id','active_status','container_id']
            })
            if(getShipment ==null || getShipment.active_status==false){
                throw{
                    code: 401,
                    message: (getShipment==null?`${uuid} not found`:`${getShipment.number} not found`)
                }
            }
            const updateContainer = await container.update({
                status:"Ready"
            },{
                where:{
                    id:getShipment.container_id
                }
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
        // try{
            const {number, status,POL, POD, ETD, ETA, stuffing_date, shipper, remark_description} = req.body
            const {uuid} = req.params
            let container_number = req.body.container_number
            
            const getShipment = await shipment.findOne({
                where:{uuid:uuid},
                attributes:['shipment_detail_id','container_id']
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
            const cont_id =  await container.findOne({
                where:{
                    number: container_number
                },
                attributes:['id']
            })

            if(cont_id.id != getShipment.container_id){
                const updateContStatus = await container.update({
                    status: "Ready"
                },{
                    where:{
                        id: getShipment.container_id
                    }
                })
                const cont_id =  await container.findOne({
                    where:{
                        number: container_number
                    }
                })
                if(cont_id.status!= "Ready"){
                    throw{
                        code:401,
                        message:`container ${container_number} status ${cont_id.status}, please choose another container`
                    }
                }
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
                container_id: cont_id.id,
                return_empty: (status=="Return"? new Date():null),
                status:status,
                shipment_detail_id: updateShipmentDetails[1][0].id,
                remark_description: (status== "Pickup"|| status=="Accident" ? remark_description:null)
            },{
                where:{uuid:uuid},
                returning: true
            })
            const addShipmentLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: editShipment[1][0].id,
                repair_id: null,
                activity_info: `Updated Shipment ${editShipment[1][0].number}`
            })
            res.status(200).json({
                status: "update Shipments successful",
                Shipment: editShipment[1][0]
            })
        // }catch(err){
        //     res.status(402).json({
        //         message:err
        //     })
        // }
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
                    medan: ShipmentMedan,
                    jakarta: ShipmentJakarta,
                    makassar: ShipmentMakassar,
                    surabaya: ShipmentSurabaya
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