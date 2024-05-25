const express = require('express')
const router = express.Router()
const users = require('./usersRoute')
const repair = require('./repairRoute')
const containers = require('./containersRoute')
const shipments = require('./shipmentsRoute')
const authentication = require('../middlewares/authentication')

router.use(users)
router.use(authentication)
router.use(repair,containers,shipments)

module.exports= router