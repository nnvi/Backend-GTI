const { v4: uuidv4 } = require('uuid');
const {shipment,container,shipment_detail,users, log_activity}= require('../models');
const { Op } = require('sequelize');

class ShipmentController{
    //get all Shipment
    static async getShipment(req,res){
        try{
            const page = (req.query.page== undefined? 1: req.query.page)
            const pageSize = 5
            const start = (page-1)*pageSize
            const end = page*pageSize

            const countShipment = await shipment.count()
            const totalPage = (Math.floor(countShipment/pageSize))+1

            const getAllShipment=await shipment.findAll({
                include: [{
                    model: shipment_detail,
                    attributes:['shipper','POL','POD']
                }]
            })
            const pageShipment = getAllShipment.slice(start,end)

            res.status(200).json({
                page: page,
                totalShipment: countShipment,
                totalPage: totalPage,
                containers: pageShipment
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
            // const cont = cont_id.map(cont_id=>cont_id.id)
  
            const create = await shipment.create({
                uuid: uuidv4(),
                number: number,
                user_id: req.UserData.id,
                container_id: cont_id[0].id,
                return_empty: null,
                status:status,
                shipment_detail_id: createdetails.id,
                remark_description: null,
                image: null,
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
                shipment_id: null,
                repair_id: null,
                activity_info: "Added New Shipment"
            })
            res.status(200).json({
                message:"add shipment successfull",
                Shipment: create
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
                attributes:['number','status'],
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
            const deleteShipment = await shipment.destroy({where:{uuid:uuid}})
            const addShipmentLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "Deleted a Shipment"
            })
            res.status(200).json({
                message: "deleted Shipment success"
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
            const {Shipment_number, user_id, container_id, return_empty, status, shipment_detail_id, remark_description, image, active_status, delete_by} = req.body
            const {id} = req.params
            const editShipment = await shipment.update({
                shipment_number: Shipment_number,
                user_id: req.UserData.id,
                container_id: container_id,
                return_empty: return_empty,
                status:status,
                shipment_detail_id: shipment_detail_id,
                remark_description: remark_description,
                image: image,
                active_status: active_status,
            },{
                where:{id},
                returning: true
            })
            const addShipmentLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "Updated a Shipment"
            })
            res.status(200).json({
                status: "update Shipments successful",
                Shipment: editShipment[1][0]
            })
        }catch(err){
            res.status(402).json({
                message:err
            })
        }
    }
}

module.exports = ShipmentController