const express = require('express')
const router = express.Router()
const {addRepair, getRepair, getRepairbyId, deleteRepair, EditRepair} = require('../controllers/repairController')
const upload = require('../middlewares/multer')

router.get('/repair',getRepair )
router.post('/repair',upload.single('image'),addRepair)
router.get('/repair/:id',getRepairbyId)
router.delete('/repair/:id', deleteRepair)
router.put('/repair/:id',upload.single('image'), EditRepair)

module.exports =router