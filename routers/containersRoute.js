const express = require('express')
const router = express.Router()
const {addContainer, getContainer, getContainerbyUuid, deleteContainer, editContainer, ContainerReady, getContainerByStatus} = require('../controllers/containerController')
const ContAuthorization = require('../middlewares/authorization')

router.get('/containers',getContainer )
router.get('/containers/dashboard',getContainerByStatus)
router.post('/containers',ContAuthorization,addContainer)
router.get('/containers/ready',ContAuthorization, ContainerReady)
router.get('/containers/:uuid',ContAuthorization,getContainerbyUuid)
router.delete('/containers/:uuid',ContAuthorization, deleteContainer)
router.put('/containers/:uuid',ContAuthorization, editContainer)


module.exports =router