
// The controller function that going to handle sending mails to the emails 
const sendEmailConroller = async (req, res) => {
    try {

        {/* 
            lang => This is the favorite language of the client that user will send the email to. It must be one of these: ["en","du"]
            type => This is the name of the file
            subject => This is the subject of the email
            from => From email sender
            to => To email sender
            data => This is the data will be inserted into the email depending on the type the user has chosen
        */}


        const { lang, type, from, to, subject, data } = req.body
        // const data = req.body


        console.log('lang', lang)
        console.log('type', type)
        console.log('from', from)
        console.log('to', to)
        console.log('subject', subject)
        console.log('data', data)





    } catch (error) {
        console.log('error', error)
    }
}



module.exports = {
    sendEmailConroller,
}