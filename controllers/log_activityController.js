const {log_activity}= require('../models')

class LogActivityController{
    //get all LogActivity
    static async getLogActivity(req,res){
        try{
            const page = (req.query.page== undefined? 1: req.query.page)
            const start = (page-1)*5
            const end = page*5

            const getAllLogActivity=await log_activity.findAll()
            const paginationLog = getAllLogActivity.slice(start,end)

            res.status(200).json(paginationLog)
        }
        catch(err){
            res.status(500).json({message:err})
        }
    }

    //delete LogActivity by id
    // static async deleteLogActivity(req,res){
    //     try{
    //         const {id}= req.params
    //         const deleteLogActivity = await log_activity.destroy({where:{id}})
    //         res.status(200).json({
    //             message: "deleted LogActivity success"
    //         })

    //     }catch(err){
    //         res.status(401).json({
    //             message:err
    //         })
    //     }
    // }

    // static async EditLogActivity(req,res){
    //     try{
    //         const {user_id,shipment_id, repair_id,activity_info} = req.body   
    //         const {id} = req.params            
    //         const editLogActivity = await log_activity.update({
    //             user_id: user_id,
    //             shipment_id: shipment_id,
    //             repair_id: repair_id,
    //             activity_info:activity_info, 
    //         },{
    //             where:{id},
    //             returning: true
    //         })
    //         res.status(200).json({
    //             status: "update log_activity successful",
    //             LogActivity: editLogActivity[1][0]
    //         })
    //     }catch(err){
    //         res.status(402).json({
    //             message:err
    //         })
    //     }
    // }
}

module.exports = LogActivityController