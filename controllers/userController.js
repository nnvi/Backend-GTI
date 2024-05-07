const { v4: uuidv4 } = require('uuid');
const { generateToken } = require("../helpers/jwt")
const {comparePassword, hashPassword}= require('../helpers/bcrypt')
const {users}= require('../models')

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
              token
            })
      
          } catch (error) {
            res.status(error?.code || 500).json(error)
            
          }
    }

    //get all user
    static async getUser(req,res){
        try{
            const page = req.query.page
            const start = (page-1)*5
            const end = page*5

            const getAllUser=await users.findAll()

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
            const {name,email, password,role, location,user_image} = req.body
            const hashedPassword = hashPassword(password)
            const create = await users.create({
                user_uuid: uuidv4(),
                name: name,
                email: email,
                password: hashedPassword,
                role:role,
                location: location,
                user_image: user_image
            })
            res.status(200).json({
                user: create
            })
        }catch(err){
            res.status(500).json({
                message: err
            })
        }
    }

    //get user by id
    static async getUserbyId(req,res){
        try{
            const id = req.params.id
            const getUserId = await users.findByPk(id)
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
            const {name,email, password,role, location,user_image} = req.body
            const {id} = req.params
            const hashedPassword = hashPassword(password)
            const editUser = await users.update({
                name:name,
                email:email,
                password:hashedPassword,
                role:role,
                location:location,
                user_image: user_image
            },{
                where:{id},
                returning: true
            })
            res.status(200).json({
                status: "update users successful",
                user: editUser[1][0]
            })
        }catch(err){
            res.status(402).json({
                message:err
            })
        }
    }
}

module.exports = userController