const nodemailer = require('nodemailer');
// const hbs = require('nodemailer-express-handlebars');
const path = require('path');
// const handlebars = require('handlebars');
// const fs = require('fs');



// Environment variables
const {
    EMAIL_CONTACT_USER,
    EMAIL_CONTACT_PASSWORD,
    EMAIL_PROVIDER_HOST,
    EMAIL_PROVIDER_PORT,
} = process.env;


// The controller function that going to handle sending mails to the emails 
const sendEmailConroller = async (req, res) => {

    // Dynamically import the ES Module
    const { default: nodemailerExpressHandlebars } = await import('nodemailer-express-handlebars');


    try {

        {/* 
            lang => This is the favorite language of the client that user will send the email to. It must be one of these: ["en","du"]
            type => This is the name of the file
            subject => This is the subject of the email
            from => From email sender
            to => To email sender
            data => This is the data will be inserted into the email depending on the type the user has chosen
        */}


        // const { lang, type, from, to, subject, data } = req.body
        var { lang, type, fileName, to, subject, data } = req.body

        // The data that will be sent to the template 


        // Configure the name of the file depending on the language and type 
        fileName = `${lang}/${type}/${fileName}`


        // Configure the transporter
        const transporter = nodemailer.createTransport({
            host: EMAIL_PROVIDER_HOST, // Replace with your SMTP host
            port: parseInt(EMAIL_PROVIDER_PORT, 10) || 587, // Port, defaulting to 587
            auth: {
                user: EMAIL_CONTACT_USER, // Sender email address
                pass: EMAIL_CONTACT_PASSWORD, // Sender email password
            },
        })



        // Set up handlebars options
        const handlebarOptions = {
            viewEngine: {
                extname: '.hbs', // Handlebars extension
                defaultLayout: false, // Set false if you are not using default layouts
            },
            viewPath: path.join(__dirname, '../views'), // Path to templates folder
            extName: '.hbs',
        };


        // Attach the Handlebars plugin to the transporter
        transporter.use('compile', nodemailerExpressHandlebars(handlebarOptions));


        // Read the image file (make sure you have an image file on your server or local path)
        const logoPath = path.join(__dirname, '../public/images/logo.png');
        const coloredLogoPath = path.join(__dirname, '../public/images/colored-logo.png');
        // const headerVector = path.join(__dirname, '../public/images/header-vector.png');


        // Send the email j
        const info = await transporter.sendMail({
            from: EMAIL_CONTACT_USER, // Sender address
            to, // List of recipients
            subject, // Subject line
            template: fileName, // The name of the template file (without extension)
            context: data,
            attachments: [
                {
                    filename: 'logo.png',
                    path: logoPath, // Path to the image
                    cid: 'logo', // The CID identifier to reference the image inline
                },
                {
                    filename: 'colored-logo.png',
                    path: coloredLogoPath, // Path to the image
                    cid: 'colored-logo', // The CID identifier to reference the image inline
                },
                // {
                //     filename: 'header-vector.png',
                //     path: headerVector, // Path to the image
                //     cid: 'header-vector', // The CID identifier to reference the image inline
                // },
            ],
        });


        // Return the success message 
        res.status(200).send('Message sent successfully.')
        console.log(info)

    } catch (error) {
        console.log('error', error)

        // Return the success message 
        res.status(500).send('Something wrong happened.')
    }
}



module.exports = {
    sendEmailConroller,
}