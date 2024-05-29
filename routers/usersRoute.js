const express = require('express')
const router = express.Router()
const {addUser, getUser, getUserbyId, deleteUser, EditUser, login, currentUser} = require('../controllers/userController')
const authentication = require('../middlewares/authentication')
const userAuthorization = require('../middlewares/authorization')
const upload = require('../middlewares/multer')


router.post('/login',login)
router.use(authentication)
router.get('/getMe',currentUser)
router.get('/users',userAuthorization,getUser)
router.post('/users',upload.single('user_image'),userAuthorization,addUser)
router.get('/users/:id',userAuthorization,getUserbyId)
router.delete('/users/:id',userAuthorization, deleteUser)
router.put('/users/:id',upload.single('user_image'), EditUser)

module.exports =router