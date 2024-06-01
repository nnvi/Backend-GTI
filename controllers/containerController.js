const { v4: uuidv4 } = require('uuid');
const {container,users,log_activity}= require('../models');
const { Model, where } = require('sequelize');

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
                totalUsers: countCont,
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
                    uuid: create.container_uuid,
                    number: create.container_number,
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

    //get container by id
    static async getContainerbyUuid(req,res){
        try{
            const {container_uuid} = req.params
            const getcontainerId = await container.findOne({
                where:{
                    uuid: container_uuid
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

    //delete container by id
    static async deleteContainer(req,res){
        try{
            const {container_uuid}= req.params
            const deletecontainer = await container.destroy({where:{uuid:container_uuid}})
            const delContainerLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "Deleted Container"
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

    static async editContainer(req,res){
        try{
            const {container_number, age, location, iddle_days, type} = req.body
            const {id} = req.params
            const editcontainer = await container.update({
                number: container_number,
                age: age,
                user_id: req.UserData.id,
                location: location,
                iddle_days: iddle_days,
                type: type
            },{
                where:{id},
                returning: true
            })
            res.status(200).json({
                status: "update containers successful",
                container: editcontainer[1][0]
            })
        }catch(err){
            res.status(402).json({
                message:err
            })
        }
    }

    //for dashboard get cont status
    static async ContainerReady(req,res){
        try{
            const contReady=await container.findAll({
                where:{status: "Ready" },
                attributes:['container_number']
            })
            res.status(200).json({
                container: contReady
            })
        }catch(err){
            res.status(500).json({
                message:err
            })
        }
    }
}

module.exports = containerController