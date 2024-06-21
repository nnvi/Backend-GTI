const { v4: uuidv4 } = require('uuid');
const { generateToken } = require("../helpers/jwt")
const { comparePassword, hashPassword } = require('../helpers/bcrypt')
const { users, log_activity } = require('../models')
const cloudinary = require('../middlewares/cloudinary')
const sharp = require('sharp');
const path = require('path');

class userController {
  //user login
  static async login(req, res) {
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
        return res.status(404).json({
          code: 404,
          message: "User not found"
        })
      }

      // compare password
      const isCorrect = comparePassword(password, user.password)
      if (!isCorrect) {
        return res.status(401).json({
          code: 401,
          message: "Incorrect password"
        })
      }

      const response = {
        id: user.id,
        email: user.email
      }
      const token = generateToken(response)

      res.status(200).json({

        token: token

      })

    } catch (error) {
      res.status(error?.code || 500).json(error.message)

    }
  }

  //get current user
  static async currentUser(req, res) {
    try {
      const getMe = await users.findByPk(req.UserData.id, {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });

      res.status(200).json({
        user: getMe,
      });
    } catch (err) {
      res.status(err?.code || 500).json(err.message);
    }

  }

  //get all user
  static async getUser(req, res) {
    try {
      const page = parseInt(req.query.page == undefined ? 1 : req.query.page)
      const pageSize = 5
      const start = (page - 1) * pageSize
      const end = page * pageSize

      const countUser = await users.count()
      const totalPage = (countUser % pageSize != 0 ? (Math.floor(countUser / pageSize)) + 1 : (Math.floor(countUser / pageSize)))

      const getAllUser = await users.findAll({
        attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'role', 'location', 'user_image'] },
      })
      getAllUser.sort((a, b) => a.id - b.id);
      const paginationUser = getAllUser.slice(start, end)

      res.status(200).json({
        page: page,
        totalUsers: countUser,
        totalPage: totalPage,
        users: paginationUser
      })
    }
    catch (err) {
      res.status(500).json({ message: err.message })
    }
  }

  // add a new user
  static async addUser(req, res) {
    try {
      const { name, email, password, role, location } = req.body
      const hashedPassword = hashPassword(password)

      const checkEmail = await users.findOne({
        where: { email: email }
      })
      if (checkEmail != null) {
        return res.status(401).json({
          code: 401,
          message: "Email already used"
        })
      }
      let result = {}
      if (req.file != null || req.file != undefined) {
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
      } else {
        result = null
      }
      const create = await users.create({
        uuid: uuidv4(),
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
        location: location,
        image: (result == null ? result : result.secure_url)
      }, function (err, result) {
        if (err) {
          return res.status(500).json({
            message: "Add new User failed"
          })
        }
        return result
      })
      const addLog = await log_activity.create({
        user_id: req.UserData.id,
        shipment_id: null,
        repair_id: null,
        activity_info: `add new user ${create.name}`
      })
      res.status(201).json({
        message: `Successfully add user ${create.name} !`,
        user: {
          id: create.id,
          uuid: create.uuid,
          name: create.name,
          email: create.email,
          role: create.role,
          location: create.location,
          image: create.image
        }
      })
    } catch (err) {
      res.status(501).json({
        message: err.message
      })
    }
  }

  //get user by id
  static async getUserbyUuid(req, res) {
    try {
      const { uuid } = req.params
      const getUserId = await users.findOne({
        where: {
          uuid: uuid
        },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
      });

      res.status(200).json({
        user: getUserId
      })
    } catch (err) {
      res.status(501).json({
        message: err.message
      })
    }
  }

  static async deleteUser(req, res) {
    try {
      const { uuid } = req.params;
      const getUser = await users.findOne({
        where: {
          uuid: uuid,
        },
        attributes: { only: ['image', 'name'] },
      });

      if (getUser.image != null) {
        const imageName = `profile_pictures/${getUser.image.split('/').pop().split('.')[0]}`;
        await cloudinary.uploader.destroy(imageName, function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: "failed to delete old picture"
            });
          }
        });
      }

      const deleteUser = await users.destroy({
        where: {
          uuid: uuid,
        },
      });
      const delUserLog = await log_activity.create({
        user_id: req.UserData.id,
        shipment_id: null,
        repair_id: null,
        activity_info: `delete user data ${getUser.name}`,
      });
      res.status(200).json({
        message: `User deleted successfully`,
      });
    } catch (err) {
      res.status(401).json({
        message: err.message,
      });
    }
  }

  static async EditUser(req, res) {
    try {
      const { name, email, password, role, location } = req.body
      const { uuid } = req.params
      const hashedPassword = password ? hashPassword(password) : null;
      const getUser = await users.findOne({
        where: {
          uuid: uuid,
        },
        attributes: { only: ['name', 'image', 'password'] },
      });
      if (!getUser) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      let result = {};
      if (req.file) {
        if (getUser.image) {
          const imageName = `profile_pictures/${getUser.image.split('/').pop().split('.')[0]}`;
          await cloudinary.uploader.destroy(imageName, function (err, result) {
            if (err) {
              console.log(err);
              return res.status(500).json({
                message: "failed to delete old picture",
              });
            }
          });
        }

        result = await cloudinary.uploader.upload(req.file.path, {folder: "profile_pictures"}, function(err, result) {
                if (err) {
                  console.log(err);
                  return res.status(500).json({
                    status: "failed upload picture",
                    message: err
                  });
                }
                return result;
              });
      } else {
        result = null;
      }
      const editUser = await users.update({
        name: name,
        email: email,
        password: hashedPassword ? hashedPassword : getUser.password,
        role: role,
        location: location,
        image: result ? result.secure_url : getUser.image
      }, {
        where: { uuid: uuid },
        returning: true
      })

      const editUserLog = await log_activity.create({
        user_id: req.UserData.id,
        shipment_id: null,
        repair_id: null,
        activity_info: `edit user data ${getUser.name}`
      })
      res.status(200).json({
        message: `User updated successfully`,
        user: {
          id: editUser[1][0].id,
          uuid: editUser[1][0].uuid,
          name: editUser[1][0].name,
          email: editUser[1][0].email,
          role: editUser[1][0].role,
          location: editUser[1][0].location,
          image: editUser[1][0].image
        }
      })
    } catch (err) {
      res.status(402).json({
        message: err.message
      })
    }
  }
}

module.exports = userController
