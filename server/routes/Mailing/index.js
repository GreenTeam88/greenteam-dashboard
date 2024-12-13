const express = require('express')
const router = express.Router()

// Importing the required controllers 
const { sendEmailConroller } = require('../../controllers/sendEmailController')


// Send emails route
router.post('/', sendEmailConroller)



module.exports = router