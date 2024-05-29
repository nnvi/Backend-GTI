const express = require('express')
const router = express.Router()
const {addShipment, getShipment, getShipmentbyId, deleteShipment, editShipment} = require('../controllers/shipmentController')


router.get('/shipment',getShipment )
router.post('/shipment',addShipment)
router.get('/shipment/:id',getShipmentbyId)
router.delete('/shipment/:id', deleteShipment)
router.put('/shipment/:id', editShipment)

module.exports =router