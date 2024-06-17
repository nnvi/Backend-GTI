const express = require('express')
const router = express.Router()
const {addUser, getUser, getUserbyUuid, deleteUser, EditUser, login, currentUser} = require('../controllers/userController')
const userAuthorization = require('../middlewares/authorization')
const upload = require('../middlewares/multer')

router.get('/users',userAuthorization,getUser)
router.post('/users',upload.single('image'),userAuthorization,addUser)
router.get('/users/:uuid',userAuthorization,getUserbyUuid)
router.delete('/users/:uuid',userAuthorization, deleteUser)
router.put('/users/:uuid',upload.single('image'), EditUser)

module.exports =router