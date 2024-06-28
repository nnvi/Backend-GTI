const {users}= require('../models')

function userAuthorization(req,res,next){
    try{
        const data = req.UserData
        users.findByPk(data.id)
        .then((result)=>{
            if (result.role !=="Super Admin"){
                return res.status(403).json({
                    error: "Authorization Error",
                    Message: `You don't have access to this feature!`,
                })
            }else{
                next()
            }
        })
    }catch{((err) => {
        return res.status(504).json(err.message)        
    })}
}

function ContAuthorization(req,res,next){
    try{
        const data = req.UserData
        users.findByPk(data.id)
        .then((result)=>{
            if (result.role !=="Super Admin"|| result.role !=="Customer Service"){
                return res.status(403).json({
                    error: "Authorization Error",
                    Message: `You don't have access to this feature!`,
                })
            }else{
                next()
            }
        })
    }catch{((err) => {
        return res.status(500).json(err.message)        
    })}
}

module.exports= {userAuthorization,ContAuthorization}