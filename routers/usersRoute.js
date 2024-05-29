const express = require('express')
const router = express.Router()
const {addUser, getUser, getUserbyId, deleteUser, EditUser, login, currentUser} = require('../controllers/userController')
const authentication = require('../middlewares/authentication')
const userAuthorization = require('../middlewares/authorization')
const upload = require('../middlewares/multer')


router.post('/login',login)
router.use(authentication)
router.get('/getMe',userAuthorization,currentUser)
router.get('/user',userAuthorization,getUser)
router.post('/user',upload.single('user_image'),userAuthorization,addUser)
router.get('/user/:id',userAuthorization,getUserbyId)
router.delete('/user/:id',userAuthorization, deleteUser)
router.put('/user/:id',upload.single('user_image'), EditUser)

module.exports =router