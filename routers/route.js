const express = require('express')
const router = express.Router()
const users = require('./usersRoute')
const repair = require('./repairRoute')
const logactivity = require('./log_activityRoute')
const containers = require('./containersRoute')
const shipments = require('./shipmentsRoute')
const shipmentdetails = require('./shipmentDetailsRoute')
const authentication = require('../middlewares/authentication')

router.use(users)
router.use(authentication)
router.use(repair,containers,shipments,shipmentdetails,logactivity)

module.exports= router