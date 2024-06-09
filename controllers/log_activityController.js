const { where, Op } = require('sequelize')
const {log_activity,users}= require('../models')

class LogActivityController{
    //get all LogActivity
    static async getLogActivity(req,res){
        try{
            const page = parseInt(req.query.page== undefined? 1: req.query.page)
            const pageSize = 5
            const start = (page-1)*pageSize
            const end = page*pageSize
            const search = req.query.search || ''

            const checkDate = /^\d{4}-\d{2}-\d{2}$/;

            const countLog = await log_activity.count()
            const totalPage = (countLog % pageSize != 0? (Math.floor(countLog/pageSize))+1: countLog/pageSize)
            let whereClause = {};
            if (checkDate.test(search)) {
                // If search is a valid date, filter by date
                whereClause = {
                    createdAt: {
                        [Op.between]: [new Date(search), new Date(new Date(search).getTime() + 86400000)] // Assuming search represents a single day
                    }
                };
            } else {
                // If search is not a valid date, assume it's a user name and filter by user name
                whereClause = {
                    '$user.name$': {
                        [Op.like]: `%${search}%`
                    }
                };
            }

            const getAllLogActivity=await log_activity.findAll({
                attributes:['id','user_id','activity_info'],
                include:{
                    model: users,
                    attributes:['name']
                },
                where:whereClause
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
            res.status(500).json({message:err.message})
        }
    }
}

module.exports = LogActivityController