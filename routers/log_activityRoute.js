const express = require('express')
const router = express.Router()
const {addLogActivity, getLogActivity, getLogActivitybyId, deleteLogActivity, EditLogActivity} = require('../controllers/log_activityController')
const userAuthorization = require('../middlewares/authorization')

router.use(userAuthorization)
router.get('/getLogActivity',getLogActivity )
router.post('/addLogActivity',addLogActivity)
router.get('/LogActivity/:id',getLogActivitybyId)
router.delete('/LogActivity/:id', deleteLogActivity)
router.put('/LogActivity/:id', EditLogActivity)

module.exports =router