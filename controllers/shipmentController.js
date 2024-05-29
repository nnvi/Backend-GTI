const { v4: uuidv4 } = require('uuid');
const {shipment,container,shipment_detail,users}= require('../models');

class ShipmentController{
    //get all Shipment
    static async getShipment(req,res){
        try{
            const page = (req.query.page== undefined? 1: req.query.page)
            const start = (page-1)*5
            const end = page*5

            const getAllShipment=await shipment.findAll({
                include: [{
                    model: users,
                    attributes:{exclude:['password']}
                },
                container,shipment_detail]
            })
            const pageShipment = getAllShipment.slice(start,end)

            res.status(200).json(pageShipment)
        }
        catch(err){
            res.status(500).json({message:err})
        }
    }
    
    // add a new Shipment
    static async addShipment(req,res){
        try{
            const {shipment_number, container_number, status,POL, POD, ETD, ETA, stuffing_date, shipper} = req.body
            
            const createdetails= await shipment_detail.create({POL, POD, ETD, ETA, stuffing_date, shipper})

            const cont_id =  await container.findAll({
                where:{
                    container_number: container_number
                }
            }) 
            const create = await shipment.create({
                shipment_uuid: uuidv4(),
                shipment_number: shipment_number,
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
            res.status(200).json({
                Shipment: create
            })
        }catch(err){
            res.status(500).json({
                message: err
            })
        }
    }

    //get Shipment by id
    static async getShipmentbyId(req,res){
        try{
            const id = req.params.id
            const getShipmentId = await shipment.findByPk(id,{
                include: [{
                    model: users,
                    attributes:{exclude:['password']}
                },
                container,shipment_detail]
            })
            res.status(200).json({shipment:getShipmentId})
        }catch(err){
            res.status(501).json({
                message:err
            })
        }
    }

    //delete Shipment by id
    static async deleteShipment(req,res){
        try{
            const {id}= req.params
            const deleteShipment = await shipment.destroy({where:{id}})
            res.status(200).json({
                message: "deleted Shipment success"
            })

        }catch(err){
            res.status(401).json({
                message:err
            })
        }
    }

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