const express = require('express')
const router = express.Router()
const {addRepair, getRepair, getRepairbyId, deleteRepair, EditRepair} = require('../controllers/repairController')
const upload = require('../middlewares/multer')

router.get('/getRepair',getRepair )
router.post('/addRepair',upload.single('image'),addRepair)
router.get('/Repair/:id',getRepairbyId)
router.delete('/Repair/:id', deleteRepair)
router.put('/Repair/:id',upload.single('image'), EditRepair)

module.exports =router