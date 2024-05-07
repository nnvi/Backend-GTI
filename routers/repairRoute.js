const express = require('express')
const router = express.Router()
const {addRepair, getRepair, getRepairbyId, deleteRepair, EditRepair} = require('../controllers/repairController')


router.get('/getRepair',getRepair )
router.post('/addRepair',addRepair)
router.get('/Repair/:id',getRepairbyId)
router.delete('/Repair/:id', deleteRepair)
router.put('/Repair/:id', EditRepair)

module.exports =router