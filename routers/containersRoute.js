const express = require('express')
const router = express.Router()
const {addContainer, getContainer, getContainerbyId, deleteContainer, editContainer} = require('../controllers/containerController')
const ContAuthorization = require('../middlewares/authorization')
const upload = require('../middlewares/multer')

router.get('/getContainer',ContAuthorization,getContainer )
router.post('/addContainer',ContAuthorization,addContainer)
router.get('/container/:id',ContAuthorization,getContainerbyId)
router.delete('/container/:id',ContAuthorization, deleteContainer)
router.put('/container/:id',ContAuthorization, editContainer)

module.exports =router