const express = require('express')
const router = express.Router()



// Importing the required controllers 
const { sendEmailConroller } = require('../../controllers/sendEmailController')


// Send emails route
router.post('/', sendEmailConroller)




router.get('/', (req, res) => {

    // res.send('hello')

    // res.render('welcome', { title: 'Welcome!', message: 'Hello from Handlebars!' });
    // res.render('en/admin/welcome');


    res.render("en/admin/collaboration-proposal-accepted", {
        projectnumber: "123456",
        nameSubcontractor: "Sub contractor"
    });


})


module.exports = router