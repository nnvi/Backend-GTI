const { v4: uuidv4 } = require('uuid');
const {repair,container,users,log_activity}= require('../models')
const cloudinary = require('../middlewares/cloudinary')
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
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
            const result = await cloudinary.uploader.upload(req.file.path,{folder: "repair_picture"},function(err,result){
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        status: "failed",
                        message: "ERROR"
                    })
                }
                return result
            });                 
            const create = await repair.create({
                uuid: uuidv4(),
                id: req.UserData.id,
                container_id: cont_id[0].id,
                remarks: remarks,
                image: result.secure_url,                
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
                message:err
            })
        }
    }    

    //delete Repair by id
    static async deleteRepair(req,res){
        try{
            const {id}= req.params
            const deleteRepair = await repair.destroy({where:{id}})
            const addRepairLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "Deleted a Repairment"
            })
            res.status(200).json({
                message: "deleted Repair success"
            })

        }catch(err){
            res.status(401).json({
                message:err
            })
        }
    }

    static async EditRepair(req,res){
        try{
            const {number, remarks} = req.body     
            const {id} = req.params   
            const imageUpdate = await cloudinary.uploader.upload(req.file.path,{folder: "profile_pictures"},function(err,result){
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        status: "failed",
                        message: "ERROR"
                    })
                }
                return result
            });
            const cont_id =  await container.findAll({
                where:{
                    number: number
                }
            }) 
            const editRepair = await repair.update({
                user_id: req.UserData.id,
                container_id: cont_id[0].id,
                remarks: remarks,
                image:imageUpdate.secure_url,
            },{
                where:{id},
                returning: true
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
                activity_info: "Updated a Repairment"
            })
            res.status(200).json({
                status: "update Repairs successful",
                Repair: editRepair[1][0]
            })
        }catch(err){
            res.status(402).json({
                message:err
            })
        }
    }
}

module.exports = RepairController