const { v4: uuidv4 } = require('uuid');
const {container,users}= require('../models');

class containerController{
    //get all container
    static async getContainer(req,res){
        try{
            const page = req.query.page
            const start = (page-1)*5
            const end = page*5

            const getAllContainer=await container.findAll({
                include: users
            })
            const pageContainer = getAllContainer.slice(start,end)
            res.status(200).json(pageContainer)
        }
        catch(err){
            res.status(500).json({message:err})
        }
    }

    // add a new container
    static async addContainer(req,res){
        try{
            const {container_number, age, location, iddle_days, type} = req.body
            const create = await container.create({
                container_uuid: uuidv4(),
                container_number: container_number,
                user_id: req.UserData.id,
                age: age,
                location: location,
                iddle_days:iddle_days,
                type: type,
                status: "Ready"
            })
            res.status(200).json({
                container: create
            })
        }catch(err){
            res.status(500).json({
                message: err
            })
        }
    }

    //get container by id
    static async getContainerbyId(req,res){
        try{
            const id = req.params.id
            const getcontainerId = await container.findByPk(id)
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
            const {id}= req.params
            const deletecontainer = await container.destroy({where:{id}})
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
                container_number: container_number,
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
}

module.exports = containerController