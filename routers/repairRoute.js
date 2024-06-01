const express = require('express')
const router = express.Router()
const {addRepair, getRepair, getRepairbyUuid, deleteRepair, EditRepair} = require('../controllers/repairController')
const upload = require('../middlewares/multer')

router.get('/repairs',getRepair )
router.post('/repairs',upload.single('image'),addRepair)
router.get('/repairs/:repair_uuid',getRepairbyUuid)
router.delete('/repairs/:repair_uuid', deleteRepair)
router.put('/repairs/:repair_uuid',upload.single('image'), EditRepair)

module.exports =router