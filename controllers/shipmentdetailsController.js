const { v4: uuidv4 } = require('uuid');
const {shipment_detail}= require('../models')

class ShipmentDetailsController{
    //get all ShipmentDetails
    static async getShipmentDetails(req,res){
        try{
            const getAllShipmentDetails=await shipment_detail.findAll()

            res.status(200).json(getAllShipmentDetails)
        }
        catch(err){
            res.status(500).json({message:err})
        }
    }
    
    // add a new ShipmentDetails
    static async addShipmentDetails(req,res){
        try{
            const {POL, POD, ETD, ETA, stuffing_date, shipper} = req.body
            const create = await shipment_detail.create({
                POL: POL,
                POD: POD,
                ETD: ETD,
                ETA: ETA,
                stuffing_date: stuffing_date,
                shipper:shipper,                
            })
            res.status(200).json({
                shipment_detail: create
            })
        }catch(err){
            res.status(500).json({
                message: err
            })
        }
    }

    //get ShipmentDetails by id
    static async getShipmentDetailsbyId(req,res){
        try{
            const id = req.params.id
            const getShipmentDetailsId = await shipment_detail.findByPk(id)
            res.status(200).json({shipment_detail:getShipmentDetailsId})
        }catch(err){
            res.status(501).json({
                message:err
            })
        }
    }

    //delete ShipmentDetails by id
    static async deleteShipmentDetails(req,res){
        try{
            const {id}= req.params
            const deleteShipmentDetails = await shipment_detail.destroy({where:{id}})
            res.status(200).json({
                message: "deleted ShipmentDetails success"
            })

        }catch(err){
            res.status(401).json({
                message:err
            })
        }
    }

    static async editShipmentDetails(req,res){
        try{
            const {POL, POD, ETD, ETA, stuffing_date, shipper} = req.body
            const {id} = req.params
            const editShipmentDetails = await shipment_detail.update({
                POL: POL,
                POD: POD,
                ETD: ETD,
                ETA: ETA,
                stuffing_date: stuffing_date,
                shipper:shipper, 
            },{
                where:{id},
                returning: true
            })
            res.status(200).json({
                status: "update ShipmentDetailss successful",
                ShipmentDetails: editShipmentDetails[1][0]
            })
        }catch(err){
            res.status(402).json({
                message:err
            })
        }
    }
}

module.exports = ShipmentDetailsController