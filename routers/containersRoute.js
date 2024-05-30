const express = require('express')
const router = express.Router()
const {addContainer, getContainer, getContainerbyUuid, deleteContainer, editContainer, ContainerReady} = require('../controllers/containerController')
const ContAuthorization = require('../middlewares/authorization')

router.get('/containers',getContainer )
router.post('/containers',ContAuthorization,addContainer)
router.get('/containers/:container_uuid',ContAuthorization,getContainerbyUuid)
router.delete('/containers/:container_uuid',ContAuthorization, deleteContainer)
router.put('/containers/:container_uuid',ContAuthorization, editContainer)
router.get('/containers/ready',ContAuthorization, ContainerReady)

module.exports =router