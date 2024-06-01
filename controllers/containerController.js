const { v4: uuidv4 } = require('uuid');
const {container,users,log_activity}= require('../models');

class containerController{
    //get all container
    static async getContainer(req,res){
        try{
            const page = (req.query.page== undefined? 1: req.query.page)
            const pageSize = 5
            const start = (page-1)*pageSize
            const end = page*pageSize

            const countCont = await container.count()
            const totalPage = (Math.floor(countCont/pageSize))+1

            const getAllContainer=await container.findAll({
                attributes:{exclude:['user_id','createdAt','updatedAt']}
            })
            const pageContainer = getAllContainer.slice(start,end)
            
            res.status(200).json({
                page: page,
                totalContainer: countCont,
                totalPage: totalPage,
                containers: pageContainer
            })
        }
        catch(err){
            res.status(500).json({message:err})
        }
    }

    // add a new container
    static async addContainer(req,res){
        try{
            const {number, age, location, iddle_days, type} = req.body
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
                activity_info: "Added New Container"
            })

            res.status(200).json({
                message: "add new container successful",
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
                message: err
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
                    exclude:['createdAt','updatedAt']
                },
                include: [{
                    model: users,
                    attributes:['name']
                }]
            })
            res.status(200).json({container:getcontainerId})
        }catch(err){
            res.status(501).json({
                message:err
            })
        }
    }

    //delete container by uuid
    static async deleteContainer(req,res){
        try{
            const {uuid}= req.params
            const deletecontainer = await container.destroy({where:{uuid:uuid}})
            const delContainerLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "Deleted Container"
            })
            const addContainerLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "Deleted a Container"
            })
            res.status(200).json({
                message: "deleted container success"
            })

        }catch(err){
            res.status(401).json({
                message:err
            })
        }
    }

    //edit container data by uuid
    static async editContainer(req,res){
        try{
            const {number, age, location, iddle_days, type} = req.body
            const {uuid} = req.params
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
                activity_info: "Edited container data"
            })
            res.status(200).json({
                status: "update containers successful",
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
            const addContainerLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "Updated a Container"
            })
        }catch(err){
            res.status(402).json({
                message:err
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
                attributes:['number']
            })
            res.status(200).json({
                container: ready
            })
        }catch(err){
            res.status(500).json({
                message:err
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
                    ReadyCont,InUseCont,RepairCont
                }
            })
        }catch(err){
            res.status(500).json({
                message:err
            })
        }
    }
}

module.exports = containerController