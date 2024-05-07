const express = require('express')
const router = express.Router()
const {addShipment, getShipment, getShipmentbyId, deleteShipment, editShipment} = require('../controllers/shipmentController')


router.get('/getShipment',getShipment )
router.post('/addShipment',addShipment)
router.get('/Shipment/:id',getShipmentbyId)
router.delete('/Shipment/:id', deleteShipment)
router.put('/Shipment/:id', editShipment)

module.exports =router