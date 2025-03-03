import express from 'express'
import { bookAppointment, getProfile, loginUser, registerUser, updateProfile } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js';



const userRouter = express.Router()

// Creating an api path 
userRouter.post('/register', registerUser)

// login api for user 
userRouter.post('/login', loginUser)

// Fetch the user data 
userRouter.get('/get-profile', authUser, getProfile)

// updating the user data 
userRouter.post( '/update-profile', upload.single('image') , authUser, updateProfile )

// upload image come first  before middleware so that it can pass to middleware 

// API for user to book doctor appointment 
userRouter.post('/book-appointment', authUser, bookAppointment)


export default userRouter