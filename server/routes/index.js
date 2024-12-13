const express = require('express')
const router = express.Router()


// Routers 
const mailingRouter = require('./Mailing/index')


// Client router 
router.use('/send-mail', mailingRouter)


module.exports = router