const express = require('express')
const router = express.Router()
const {addUser, getUser, getUserbyUuid, deleteUser, EditUser, login, currentUser} = require('../controllers/userController')
const userAuthorization = require('../middlewares/authorization')
const upload = require('../middlewares/multer')

router.get('/users',userAuthorization,getUser)
router.post('/users',upload.single('user_image'),userAuthorization,addUser)
router.get('/users/:user_uuid',userAuthorization,getUserbyUuid)
router.delete('/users/:user_uuid',userAuthorization, deleteUser)
router.put('/users/:user_uuid',upload.single('user_image'), EditUser)

module.exports =router