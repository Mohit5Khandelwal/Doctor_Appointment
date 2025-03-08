import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModels.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModels.js'
import razorpay from 'razorpay'


// API to register a user 
const registerUser = async (req, res) => {

    try 
    {
        const { name, email, password } = req.body 

        if( !name || !email || !password )
        {
            return res.status(200).json({ success:false, message: "All fields are required" })
        }

        if( !validator.isEmail( email ) )
        {
            return res.status(200).json({ success:false, message: "Invalid email format" })
        }

        if( password.length < 8 )
        {
            return res.status(200).json({ success:false, message: "Password must be atleast 8 characters" })
        }

        // hash user password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // save user to database
        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel( userData )
        const user = await newUser.save()

        // getting the user id 
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET )

        res.status(200).json({ success:true, message: "User registered successfully", token })




    }
    catch (error)
    {
        console.log( error )
        res.status(500).json({ success:false, message: error.message })
    }

    
}

// API for user login 
const loginUser = async( req, res ) => {

    try
    {
        const { email, password} = req.body
        const user = await userModel.findOne({ email })

        // If that email was not found 
        if( !user )
        {
            return res.status(200).json({ success:false, message: "User not found" })
        
        }

        // Decrypt the password
        const isMatch = await bcrypt.compare( password, user.password )

        if( isMatch )
        {
            // User crenditals match done !!!
            const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET )
            return res.status( 200 ).json( { success:true, message: 'Login successfully', token })
        }
        else 
        {
            return res.status(200).json({ success:false, message: "Invalid credentials" })
        }

    }
    catch (error)
    {
        console.log( error )
        res.status(500).json({ success:false, message: error.message })
    }

}

// API to get user profile data 
const getProfile = async (req, res) => {

    try
    {
        // getting the data fetch using the userId
        const { userId } = req.body 
        const userData = await userModel.findById(userId).select('-password')

        if( !userData )
        {
            return res.status(200).json({ success:false, message: "User not found" })
        }

        res.status(200).json({ success:true, userData })
    }
    catch (error)
    {
        console.log( error )
        res.status(500).json({ success:false, message: error.message })
    }
}

// API to update user profile data 
const updateProfile = async (req, res) => {

    try
    {
        const { userId, name, phone, address, dob, gender } = req.body 
        const imageFile = req.file 

        if( !name || !phone || !dob || !gender )
        {
            return res.status(200).json({ success: false, message: 'Data Missing'})
        }

        await userModel.findByIdAndUpdate( userId, { name, phone, address: JSON.parse(address), dob, gender } )

        // If image is present upload to cloudinary 
        if( imageFile  )
        {
            // upload image to cloudinary 
            const imageUpload = await cloudinary.uploader.upload( imageFile.path, { resource_type: 'image'})

            const imageURL = imageUpload.secure_url 

            // updating image url to our db 
            await userModel.findByIdAndUpdate( userId, { image: imageURL })

        }

        res.status(200).json({ success:true, message: "Profile updated successfully" })
    }
    catch (error)
    {
        console.log( error )
        res.status(500).json({ success:false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try
    {
        const { userId, docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if( !docData.available )
        {
            return res.status(200).json({ success:false, message: "Doctor is not available" })
        
        }

        let slots_booked = docData.slots_booked

        // check for slot availability 
        if( slots_booked[slotDate] )
        {
            if( slots_booked[slotDate].includes(slotTime) )
            {
                return res.status(200).json({ success:false, message: "Slot already booked" })
            }
            else 
            {
                slots_booked[slotDate].push(slotTime)

            }
        }
        else 
        {
            // No slots is booked for current 
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {

            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        // New Appointment will be saved to our database 
        const newAppointment = new appointmentModel( appointmentData )
        await newAppointment.save()


        // save new slots data in docData 
        await doctorModel.findByIdAndUpdate( docId, { slots_booked })

        res.status(200).json({ success:true, message: "Appointment booked successfully" })

    }
    catch (error)
    {
        console.log( error )
    }
}

// API to get user appointment for frontend my-appointment page 
const listAppointment = async (req, res) => {

    try
    {
        const {userId} = req.body 
        const appointments = await appointmentModel.find( { userId })

        res.status(200).json({ success:true, appointments })
    }
    catch (error)
    {
        console.log( error )
        res.status(500).json({ success:false, message: error.message })
    }
}

// API to cancel appointment 
const cancelAppointment = async (req, res) => {

    try
    {
        const { userId, appointmentId} = req.body 

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if( appointmentData.userId !== userId )
        {
            return res.status(200).json({ success:false, message: "Unauthorized access" })
        }
        
        await appointmentModel.findByIdAndUpdate( appointmentId, { cancelled: true })

        // Release doctor slot 

        const { docId, slotDate, slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked 

        slots_booked[slotDate] = slots_booked[slotDate].filter( time => time !== slotTime )

        await doctorModel.findByIdAndUpdate( docId, { slots_booked } )

        res.status(200).json({ success:true, message: "Appointment cancelled successfully" })


    }
    catch (error)
    {
        console.log( error )
    }
}

// create an razorpay instance 
var razorpayInstance = new razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// API to make payment of appointment using razorpay 
const paymentRazorpay = async (req, res) => {

    try
    {
        const { appointmentId } = req.body 
        const appointmentData = await appointmentModel.findById(appointmentId)

        if( !appointmentData || appointmentData.cancelled )
        {
            return res.status(200).json({ success: false, message: "Appointment cancelled or not found"})
        }

        // creating options for razorpay payment 
        const options = {

            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId 

        }

        // creation of an order 
        const order = await razorpayInstance.orders.create(options)

        res.status(200).json({ success: true, order })
    }
    catch (error)
    {
        console.log( error )
        res.status(500).json({ success: false, error: error.message })
    }
}

// API to verify payment of razorpay 
const verifyRazorpay = async (req, res) => {

    try
    {
        const { razorpay_order_id } = req.body 
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        //res.status(200).json({ success: true, message: orderInfo })

        console.log( orderInfo )

        // If payment is paid then update payment status 
        if( orderInfo.status == 'paid' )
        {
            // update my appointment 
            await appointmentModel.findByIdAndUpdate( orderInfo.receipt, { payment: true })

            return res.status( 200 ).json({ success : true , message : "Payment successful"})
        }
        else 
        {
            return res.status( 200 ).json({ success : false , message : "Payment failed"})
        }
    }
    catch (error)
    {
        console.log( error )
        res.status(500).json({ success: false, error: error.message })
    }
}


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay }