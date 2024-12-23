const express = require('express')
const router = express.Router()



// Importing the required controllers 
const { sendEmailConroller } = require('../../controllers/sendEmailController')


// Send emails route
router.post('/', sendEmailConroller)




router.get('/', (req, res) => {

    // res.render("en/admin/quotation-accepted", {
    res.render("en/subContractor/email-confirmed", {
        projectnumber: "123456",
        nameSubcontractor: "Sub contractor"
    });


})

module.exports = router