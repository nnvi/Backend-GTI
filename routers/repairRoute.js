const express = require('express')
const router = express.Router()
const {addRepair, getRepair, getRepairbyUuid, deleteRepair, EditRepair, FinishRepair, historyRepair} = require('../controllers/repairController')
const upload = require('../middlewares/multer')

router.get('/repairs',getRepair )
router.get('/repairs/:uuid/history',historyRepair)
router.post('/repairs',upload.single('image'),addRepair)
router.get('/repairs/:uuid',getRepairbyUuid)
router.delete('/repairs/:uuid', deleteRepair)
router.put('/repairs/:uuid',upload.single('image'), EditRepair)
router.put('/repairs/:uuid/finish',FinishRepair)

module.exports =router