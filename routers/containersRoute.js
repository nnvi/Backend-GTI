const express = require('express')
const router = express.Router()
const {ContAuthorization} = require('../middlewares/authorization')
const {addContainer, getContainer, getContainerbyUuid, deleteContainer, editContainer, ContainerReady, getContainerByStatus, historyContainer, getLocationContainer} = require('../controllers/containerController')

router.get('/containers',getContainer )
router.get('/containers/location',getLocationContainer)
router.get('/containers/dashboard',getContainerByStatus)
router.get('/containers/:uuid/history',historyContainer)
router.post('/containers',ContAuthorization,addContainer)
router.get('/containers/ready', ContainerReady)
router.get('/containers/:uuid',getContainerbyUuid)
router.delete('/containers/:uuid',ContAuthorization, deleteContainer)
router.put('/containers/:uuid',ContAuthorization, editContainer)


module.exports =router
