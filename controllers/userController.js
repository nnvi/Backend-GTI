const { v4: uuidv4 } = require('uuid');
const { generateToken } = require("../helpers/jwt")
const {comparePassword, hashPassword}= require('../helpers/bcrypt')
const {users,log_activity}= require('../models')
const cloudinary = require('../middlewares/cloudinary')

class userController{
    //user login
    static async login(req, res){
        try {
            const {
              email,
              password
            } = req.body

            const user = await users.findOne({
              where: {
                email: email
              }
            })
      
            if (!user) {
              throw {
                code: 404,
                message: "User not found"
              }
            }
      
            // compare password
            const isCorrect = comparePassword(password, user.password)
            console.log(isCorrect);
            if (!isCorrect) {
              throw {
                code: 401,
                message: "Incorrect password"
              }
            }
      
            const response = {
              id: user.id,
              email: user.email
            }
            const token = generateToken(response)
            
            res.status(200).json({
              token: `Bearer ${token}`
            })
      
          } catch (error) {
            res.status(error?.code || 500).json(error)
            
          }
    }

    //get current user
    static async currentUser (req,res){
        try{
            const getMe = await users.findByPk(req.UserData.id,{
                attributes:{exclude:['password']}
            })
            res.status(200).json({
                user : getMe
            })
        }catch(err){
            res.status(err?.code ||500).json(err)
        }
    } 

    //get all user
    static async getUser(req,res){
        try{
            const page = (req.query.page== undefined? 1: req.query.page)
            const start = (page-1)*5
            const end = page*5

            const getAllUser=await users.findAll({
                attributes:{exclude:['password']}
            })

            const paginationUser = getAllUser.slice(start,end)

            res.status(200).json(paginationUser)
        }
        catch(err){
            res.status(500).json({message:err})
        }
    }

    // add a new user
    static async addUser(req,res){
        try{
            const {name,email, password,role, location} = req.body
            const hashedPassword = hashPassword(password)
            let result = {}
            if(req.file != null ||req.file != undefined){
                result = await cloudinary.uploader.upload(req.file.path,{folder: "profile_pictures"},function(err,result){
                    if(err){
                        console.log(err);
                        return res.status(500).json({
                            status: "failed upload pictures",
                            message: err
                        })
                    }
                    return result
                });
            }else{
                result = {secure_url :"https://res.cloudinary.com/dktcfw5wm/image/upload/v1716986649/profile_pictures/qkeeloxrjoo8jmumgpmr.jpg"}
            }
            const create = await users.create({
                user_uuid: uuidv4(),
                name: name,
                email: email,
                password: hashedPassword,
                role:role,
                location: location,
                user_image: result.secure_url
            },function(err,result){
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        status: "Add new User failed",
                        message: err
                    })
                }
                return result
            })

            const addLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "add new user"
            })
            res.status(200).json({
                message: "Add new User Successful",
                user: {
                    id: create.id,
                    user_uuid: create.user_uuid,
                    name: create.name,
                    email: create.email,
                    role: create.role,
                    location: create.location,
                    user_image: create.user_image
                }
            })
        }catch(err){
            res.status(501).json({
                message: err.message
            })
        }
    }

    //get user by id
    static async getUserbyId(req,res){
        try{
            const id = req.params.id
            const getUserId = await users.findByPk(id,{
                attributes:{exclude:['password']}
            })

            res.status(200).json({user:getUserId})
        }catch(err){
            res.status(501).json({
                message:err
            })
        }
    }

    //delete user by id
    static async deleteUser(req,res){
        try{
            const {id}= req.params
            const deleteUser = await users.destroy({where:{id}})
            const delUserLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "delete user data"
            })
            res.status(200).json({
                message: "deleted user success"
            })

        }catch(err){
            res.status(401).json({
                message:err
            })
        }
    }

    static async EditUser(req,res){
        try{
            const {name,email, password,role, location} = req.body
            const {id} = req.params
            const hashedPassword = hashPassword(password)
            let result = {}
            if(req.file != null ||req.file != undefined){
                result = await cloudinary.uploader.upload(req.file.path,{folder: "profile_pictures"},function(err,result){
                    if(err){
                        console.log(err);
                        return res.status(500).json({
                            status: "failed upload pictures",
                            message: err
                        })
                    }
                    return result
                });
            }else{
                result = {secure_url :"https://res.cloudinary.com/dktcfw5wm/image/upload/v1716986649/profile_pictures/qkeeloxrjoo8jmumgpmr.jpg"}
            }
            const editUser = await users.update({
                name:name,
                email:email,
                password:hashedPassword,
                role:role,
                location:location,
                user_image: result.secure_url
            },{
                where:{id},
                returning: true
            })
            const editUserLog = await log_activity.create({
                user_id: req.UserData.id,
                shipment_id: null,
                repair_id: null,
                activity_info: "edit user data"
            })
            res.status(200).json({
                status: "update users successful",
                user: {
                    id: editUser[1][0].id,
                    user_uuid: editUser[1][0].user_uuid,
                    name: editUser[1][0].name,
                    email: editUser[1][0].email,
                    role: editUser[1][0].role,
                    location: editUser[1][0].location,
                    user_image: editUser[1][0].user_image
                }
            })
        }catch(err){
            res.status(402).json({
                message:err
            })
        }
    }
}

module.exports = userController