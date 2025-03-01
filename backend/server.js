import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'


// app config 
const app = express()
const port = process.env.PORT || 4000 

// Calling connect DB fun from port 
connectDB() // Connecting to MongoDB Atlas 
connectCloudinary() // Connecting to cloudinary image 


// middleware
app.use(express.json())
app.use(cors()) // esaily connect frontend app with backend app 

// api routes

app.use('/api/admin', adminRouter) 
// localhost:4000/api/admin/add-doctor

app.get( '/', (req, res) => {
    res.status(200).send('API IS RUNNING MOHIT KHANDELWAL')
})

// listen 
app.listen( port, () => console.log( 'Server is started', port ) );

