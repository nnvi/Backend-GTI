const express = require('express')
const router = express.Router()
const {ContAuthorization} = require('../middlewares/authorization')
const {addShipment, getShipment, getShipmentbyUuid, deleteShipment, editShipment, getShipmentDashboard} = require('../controllers/shipmentController')

router.get('/shipments',getShipment)
router.get('/shipments/dashboard', getShipmentDashboard)
router.post('/shipments',ContAuthorization,addShipment)
router.get('/shipments/:uuid',getShipmentbyUuid)
router.delete('/shipments/:uuid',ContAuthorization, deleteShipment)
router.put('/shipments/:uuid', editShipment)

module.exports =router
