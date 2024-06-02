const { v4: uuidv4 } = require('uuid');
const {repair,container,log_activity}= require('../models')
const path = require('path');
const fs = require('fs');
const { where } = require('sequelize');

class RepairController{
    //get all Repair
    static async getRepair(req,res){
        try{
            const page = parseInt(req.query.page== undefined? 1: req.query.page)
            const pageSize = 5
            const start = (page-1)*pageSize
            const end = page*pageSize

            const countRepair = await repair.count()
            const totalPage = (countRepair%pageSize !=0? (Math.floor(countRepair/pageSize))+1:(Math.floor(countRepair/pageSize)))

            const getAllRepair=await repair.findAll({
                attributes:['id','uuid','remarks'],
                include: [{
                    model: container,
                    attributes:['number','type','location','age']
                }, container]
            })
            const pageRepair = getAllRepair.slice(start,end)

            res.status(200).json({
                page: page,
                totalRepair: countRepair,
                totalPage: totalPage,
                repairs: pageRepair
            })
        }
        catch(err){
            res.status(500).json({message:err})
        }
    }
  
    // add a new Repair
    static async addRepair(req,res){
        try{
            const {number, remarks} = req.body            
            const cont_id =  await container.findOne({
                where:{
                    number: number
                },
                
            })  
            console.log(cont_id.status);
            
            if(cont_id.status == "Repair"){
                return res.status(400).json({ Pesan: 'Kontainer sudah dalam perbaikan' });
              };                        
            const create = await repair.create({
                uuid: uuidv4(),
                user_id: req.UserData.id,
                container_id: cont_id.id,
                remarks: remarks,
                image: req.file?req.file.path:null,            
            })
            const updateCont =await container.update({
                status:"Repair"
            },{
                where:{
                    id:cont_id.id
                }
            })
            const addRepairLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "Added New Repairment"
            })
            res.status(201).json({
                meesage:"add repair successfull",
                repair: create
            })
        }catch(err){
            res.status(500).json({
                message: err.message,
                
            })
        }
    }

    //get Repair by id
    static async getRepairbyUuid(req,res){
        try{
            const {uuid} = req.params
            const getrepairId = await repair.findOne({
                where:{
                    uuid: uuid
                },
                attributes:['id','uuid','remarks'],
                include: [{
                    model: container,
                    attributes:['number','age','location','type']
                }]
            })
            res.status(200).json({repair:getrepairId})
        }catch(err){
            res.status(501).json({
                message:err.message
            })
        }
    }    

    //delete Repair by id
    static async deleteRepair(req,res){
        // try {
            const { uuid } = req.params;
            const getRepair = await repair.findOne({
              where: {
                uuid: uuid,
              },
              attributes: { only: ['image','container_id'] },
            });
            
            if(getRepair.image != null){
                const filename = getRepair.image.replace(/^uploads[\\\/]/, '');
                const filePath = path.join('uploads', filename);
      
                if (filename != null) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                        console.error(err);
                          return;
                    }
                    });
                }
            }
            const updateContainer = await container.update({
                status:"Ready"
            },{
                where:{
                    id:getRepair.container_id
                },
                returning:true
            })
            console.log(updateContainer[1][0].status);

            const deleteRepair = await repair.destroy({
                where: {
                    uuid: uuid,
                },
            });
            
            const addRepairLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: deleteRepair.id,
                activity_info: "Deleted a Repairment"
            })
            res.status(200).json({
                message: 'delete Repair success',
            });
    //         } catch (err) {
    //             res.status(401).json({
    //             message: err.message,
    //            });
    //         }
    }

    static async EditRepair(req,res){
        try{
            const {number, remarks} = req.body
            const {uuid} = req.params
            const getRepair = await repair.findOne({
                where: {
                  uuid: uuid,
                },
                attributes: { only: ['image','container_id'] },
            });
            if(getRepair.image!= null){
                const filename = getRepair.image.replace(/^uploads[\\\/]/, '');
                const filePath = path.join('uploads', filename);        
                if (filename != null) {
                    fs.unlink(filePath, (err) => {
                      if (err) {
                        console.error(err);
                        return;
                    }
                    });
                }
            }
            const cont_id =  await container.findOne({
                where:{
                    number: number
                },
                attributes:['id','number']
            })
            
            if(cont_id.id != getRepair.container_id){
                const updateContStatus = await container.update({
                    status: "Ready"
                },{
                    where:{
                        id: getRepair.container_id
                    }
                })
                const cont_id =  await container.findOne({
                    where:{
                        number: number
                    }
                })
                if(cont_id.status!= "Ready"){
                    throw{
                        code:401,
                        message:`container ${number} status ${cont_id.status}, please choose another container`
                    }
                }
            }
            const updateCont =await container.update({
                status:"Repair"
            },{
                where:{
                    number:number
                }
            })

            const editRepair = await repair.update({
                container_id: cont_id.id,
                remarks: remarks,
                image: req.file?req.file.path:getRepair.image,
            },{
                where:{uuid: uuid},
                returning: true
            })
            const editRepairLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: getRepair.id,
                activity_info: "edit repair data"
            })
            res.status(200).json({
                status: "update Repair successful",
                repair:{
                    number: cont_id.number,
                    remarks: editRepair[1][0].remarks,
                    image: editRepair[1][0].image
                }
            })
        }catch(err){
            res.status(402).json({
                message:err.message
            })
        }
    }

    static async FinishRepair(req,res){
        try{
            const {uuid} = req.params
            const getRepair = await repair.findOne({
                where: {
                uuid: uuid,
                },
                attributes: ['container_id'],
            });
            const updateContainer = await container.update({
                status: "Ready"
            },{
                where:{
                    id: getRepair.container_id
                },
                returning:true
            })
            res.status(200).json({
                message: `repair container ${updateContainer[1][0].number} finished`
            })
        }catch(err){
            res.status(501).json({
                message:err.message
            })
        }
    }

    static async historyRepair(req,res){
        try{
            const {uuid} = req.params
            const getRepair = await repair.findOne({
                where:{uuid:uuid},
                attributes:['container_id']
            })
            const getHistoryRepair = await repair.findAll({
                where:{
                    container_id: getRepair.container_id
                }
            })
            res.status(200).json(getHistoryRepair)
        }catch(err){
            res.status(501).json({
                message:err.message
            })
        }
    }
}

module.exports = RepairController