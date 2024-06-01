const express = require('express')
const router = express.Router()
const {addRepair, getRepair, getRepairbyUuid, deleteRepair, EditRepair} = require('../controllers/repairController')
const repAuthorization = require('../middlewares/authorization')
const upload = require('../middlewares/multer')

router.get('/repair',getRepair )
router.post('/repair',repAuthorization,upload.single('image'),addRepair)
router.get('/repair/:uuid',repAuthorization,getRepairbyUuid)
router.delete('/repair/:id',repAuthorization, deleteRepair)
router.patch('/repair/:id',repAuthorization,upload.single('image'), EditRepair)

module.exports =router