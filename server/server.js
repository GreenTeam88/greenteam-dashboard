require('dotenv').config();

const express = require('express')
const app = express()
const cors = require('cors');
const cookieParser = require('cookie-parser');
const _PORT = process.env.PORT

// Middlewares 
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())


// Using cors for specific URLs 
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    credentials: true
}))



// Importing the main and the router that going to handle all of the other requests 
const mainRouter = require('./routes/index')



/*  DEFINING THE MAIN ROUTER  */
app.use('/api', mainRouter)



app.get('/api', (req, res) => {
    res.send(`This is the main testing route ${process.env.BACKEND_URL}`)
})



app.listen(_PORT, () => {
    console.log('Server is running on:', _PORT)
})