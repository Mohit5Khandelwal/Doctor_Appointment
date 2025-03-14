import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModels.js'
import userModel from '../models/userModels.js';

// API for adding an doctor 
const addDoctor = async (req, res) => {

    try
    {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file 

        console.log( { name, email, password, speciality, degree, experience, about, fees, address }, imageFile )

        // checking for all data to add doctors 
        if( !name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address  )
        {
            return res.status(200).json({ success:false, message: "All fields are required" })
        }

        // validating email format 
        if( !validator.isEmail( email ))
        {
            return res.status(200).json({ success:false, message: "Invalid email format" })
        }

        // validating password length
        if( password.length < 6 )
        {
            return res.status(200).json({ success:false, message: "Password must be atleast 6 characters" })
        }

        // hashing doctor password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Getting an encrypted password

        // Upload image to cloudinary server
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
        const imageUrl = imageUpload.secure_url

        // imageUrl is an cloudinary image url 

        // storing the address as a object in a database 


        // storing the doctor data in a database
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save() 

        return res.status(200).json({ success:true, message: "Doctor added successfully" })


    }
    catch (error)
    {
        console.log( error )
        res.status(500).json({ success:false, message: "Internal server error" })
    }

}

// API For admin Login 
const loginAdmin = async (req, res) => {
    // checking admin credentails 
    try
    {
        const { email, password } = req.body;

        if( email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD )
        {
            // If all details are valid then send an json taken 
            const token = jwt.sign( email+password, process.env.JWT_SECRET)

            res.status(200).json({ success:true, message: "Admin logged in successfully", token })
        }
        else 
        {
            return res.status(200).json({ success:false, message: "Invalid credentials" })
        }

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ success:false, message: "Internal server error" })
    }

}

// API to get all doctors list for admin pannel 
const allDoctors = async (req, res) => {

    try
    {
        const doctors = await doctorModel.find({}).select('-password')
        // getting all the doctor data skipping the password from the data 
        res.status(200).json({ success:true, doctors })
    }
    catch (error)
    {
        console.log( error )
        res.status(500).json({ success: false, message: error.message})
    }
}

// API to get all appointment lists
const appointmentsAdmin = async (req, res) => {

    try {

        const appointmentList = await appointmentModel.find({});

        res.status(200).json({ success: true, appointmentList });

    }
    catch (error) {

        console.log( error );
        res.status(500).json({ success: false, message: error.message });

    }
}

// API to cancel the appointment 
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

// API to fetch data for admin dashboard 
const adminDashboard = async (req, res) => {

    try
    {
        const doctors = await doctorModel.find({})
        const users   = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            users: users.length,
            appointments: appointments.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        
        }

        res.status(200).json({ success:true, dashData })
    }
    catch (error) 
    {
        console.log( error );
        res.status(500).json({ success:false, message: error.message })
    }
}


export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, cancelAppointment, adminDashboard }