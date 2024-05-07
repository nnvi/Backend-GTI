const express = require('express')
const router = express.Router()
const {addUser, getUser, getUserbyId, deleteUser, EditUser, login} = require('../controllers/userController')
const authentication = require('../middlewares/authentication')
const userAuthorization = require('../middlewares/authorization')


router.post('/login',login)
router.use(authentication)
router.get('/getUser',userAuthorization,getUser)
router.post('/addUser',userAuthorization,addUser)
router.get('/user/:id',userAuthorization,getUserbyId)
router.delete('/user/:id',userAuthorization, deleteUser)
router.put('/user/:id', EditUser)

module.exports =router