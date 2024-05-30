const express = require('express')
const router = express.Router()
const {addShipment, getShipment, getShipmentbyUuid, deleteShipment, editShipment} = require('../controllers/shipmentController')


router.get('/shipments',getShipment )
router.post('/shipments',addShipment)
router.get('/shipments/:uuid',getShipmentbyUuid)
router.delete('/shipments/:uuid', deleteShipment)
router.put('/shipments/:uuid', editShipment)

module.exports =router