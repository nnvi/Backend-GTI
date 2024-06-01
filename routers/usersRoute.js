const express = require('express')
const router = express.Router()
const {addUser, getUser, getUserbyUuid, deleteUser, EditUser, login, currentUser} = require('../controllers/userController')
const userAuthorization = require('../middlewares/authorization')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, './uploads');
    },
    filename: function(req,file, cb){
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage})

router.get('/users',userAuthorization,getUser)
router.post('/users',upload.single('image'),userAuthorization,addUser)
router.get('/users/:uuid',userAuthorization,getUserbyUuid)
router.delete('/users/:uuid',userAuthorization, deleteUser)
router.put('/users/:uuid',upload.single('image'), EditUser)

module.exports =router