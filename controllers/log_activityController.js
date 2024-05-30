const { where } = require('sequelize')
const {log_activity,users}= require('../models')

class LogActivityController{
    //get all LogActivity
    static async getLogActivity(req,res){
        try{
            const page = (req.query.page== undefined? 1: req.query.page)
            const pageSize = 5
            const start = (page-1)*pageSize
            const end = page*pageSize

            const countLog = await log_activity.count()
            const totalPage = (countLog % pageSize != 0? (Math.floor(countLog/pageSize))+1: countLog/pageSize)

            const getAllLogActivity=await log_activity.findAll({
                attributes:['id','user_id','activity_info'],
                include:{
                    model: users,
                    attributes:['name']
                }
            })
            const paginationLog = getAllLogActivity.slice(start,end)

            res.status(200).json({
                page: page,
                totalUsers: countLog,
                totalPage: totalPage,
                users: paginationLog
            })
        }
        catch(err){
            res.status(500).json({message:err})
        }
    }
}

module.exports = LogActivityController