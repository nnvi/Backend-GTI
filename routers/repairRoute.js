const express = require('express')
const router = express.Router()
const {addRepair, getRepair, getRepairbyUuid, deleteRepair, EditRepair} = require('../controllers/repairController')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, './uploads');
    },
    filename: function(req,file, cb){
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage})

router.get('/repairs',getRepair )
router.post('/repairs',upload.single('image'),addRepair)
router.get('/repairs/:uuid',getRepairbyUuid)
router.delete('/repairs/:uuid', deleteRepair)
router.put('/repairs/:uuid',upload.single('image'), EditRepair)

module.exports =router