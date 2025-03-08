import express from 'express'
import { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, registerUser, updateProfile, paymentRazorpay, verifyRazorpay } from '../controllers/userController.js'
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


// API for user to fetch appointment for doctors 
userRouter.get('/appointments', authUser, listAppointment)

// API for user cancel the appointment 
userRouter.post('/cancel-appointment', authUser, cancelAppointment)

// API for user to payment using razorpay 
userRouter.post('/payment-razorpay', authUser, paymentRazorpay)

// API for user to verify it's payment 
userRouter.post('/verify-payment', authUser, verifyRazorpay)

// API to fetch all user appointments 

export default userRouter