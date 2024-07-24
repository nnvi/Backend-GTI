const { where, Op } = require('sequelize')
const {log_activity,users, Sequelize}= require('../models')

class LogActivityController{
    //get all LogActivity
    static async getLogActivity(req,res){
        try{
            const page = parseInt(req.query.page== undefined? 1: req.query.page)
            const pageSize = 5
            const start = (page-1)*pageSize
            const end = page*pageSize
            const search = req.query.search || ''
            search = search.toUpperCase()

            let whereClause = {};
            const getUser = await users.findOne({
                where:{id:req.UserData.id},
                attributes:['location']
            })
            whereClause = {
                '$user.location$': getUser.location,
                [Op.or]:[
                    {'$user.name$': {[Op.like]: `%${search}%`}},
                    {activity_info :{[Op.like]: `%${search}%`}}
                ]
            };
            
            const countLog = await log_activity.count({
                where:whereClause,
                include:[users]
            })
            const totalPage = (countLog % pageSize != 0? (Math.floor(countLog/pageSize))+1: countLog/pageSize)
            const getAllLogActivity=await log_activity.findAll({
                attributes:['id','user_id','activity_info','createdAt'],
                include:{
                    model: users,
                    attributes:['name','location']
                },
                where:whereClause,order: [
                    ['createdAt', 'DESC']
                ]
            })
            const paginationLog = getAllLogActivity.slice(start,end)

            res.status(200).json({
                page: page,
                totalLogs: countLog,
                totalPage: totalPage,
                logs: paginationLog
            })
        }
        catch(err){
            res.status(500).json({message:err.message})
        }
    }
}

module.exports = LogActivityController