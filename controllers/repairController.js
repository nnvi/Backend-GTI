const { v4: uuidv4 } = require('uuid');
const {repair,container,users,log_activity}= require('../models')
const path = require('path');
const fs = require('fs');

class RepairController{
    //get all Repair
    static async getRepair(req,res){
        try{
            const page = (req.query.page== undefined? 1: req.query.page)
            const start = (page-1)*5
            const end = page*5

            const getAllRepair=await repair.findAll({
                include: [{
                    model: users,
                    attributes:{exclude:['password']}
                }, container]
            })
            const pageRepair = getAllRepair.slice(start,end)

            res.status(200).json(pageRepair)
        }
        catch(err){
            res.status(500).json({message:err})
        }
    }
  
    // add a new Repair
    static async addRepair(req,res){
        try{
            const {number, remarks} = req.body            
            const cont_id =  await container.findAll({
                where:{
                    number: number
                }
            })  
            console.log(cont_id);
            // masih error 
            // if(cont_id.status == "Repair"){
            //     return res.status(400).json({ Pesan: 'Kontainer sudah dalam perbaikan' });
            //   };                        
            const create = await repair.create({
                uuid: uuidv4(),
                user_id: req.UserData.id,
                container_id: cont_id[0].id,
                remarks: remarks,
                image: req.file?req.file.path:null,                
            })
            const updateCont =await container.update({
                status:"Repair"
            },{
                where:{
                    id:cont_id[0].id
                }
            })
            const addRepairLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "Added New Repairment"
            })
            res.status(200).json({
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
            const {repair_uuid} = req.params
            const getrepairId = await repair.findOne({
                where:{
                    uuid: repair_uuid
                },
                attributes:{
                    exclude:['createdAt','updatedAt']
                },
                include: [{
                    model: container,
                    attributes:['number','age','location']
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
              attributes: { only: ['image'] },
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
                attributes: { only: ['image'] },
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
            const editRepair = await repair.update({
                number: number,
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
                repair: {
                    number: editRepair[1][0].number,
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
}

module.exports = RepairController