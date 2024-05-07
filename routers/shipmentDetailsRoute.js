const express = require('express')
const router = express.Router()
const {addShipmentDetails, getShipmentDetails, getShipmentDetailsbyId, deleteShipmentDetails, editShipmentDetails} = require('../controllers/shipmentdetailsController')


router.get('/getShipmentDetails',getShipmentDetails )
router.post('/addShipmentDetails',addShipmentDetails)
router.get('/ShipmentDetails/:id',getShipmentDetailsbyId)
router.delete('/ShipmentDetails/:id', deleteShipmentDetails)
router.put('/ShipmentDetails/:id', editShipmentDetails)

module.exports =router