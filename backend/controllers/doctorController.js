import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModels.js";


// Function to change the Avialability of Doctor 
const changeAvailability = async (req, res) => {

    try
    {
        const { docId } = req.body 

        const docData = await doctorModel.findById( docId );

        if( !docData )
        {
            return res.status(200).json({ message: "Doctor not found", success:false });
        }

        await doctorModel.findByIdAndUpdate( docId, { available: !docData.available })
        res.status(200).json({ message: "Doctor availability changed successfully", success:true });
    }
    catch (error)
    {
        console.log( error );
        res.status(500).json({ message: error.message, success:false });
    }
}


// Function to fetch all doctors data from DB
const doctorList = async (req, res) => {

    try
    {
        // Fetch all Doctors data 
        const doctors = await doctorModel.find({}).select([ '-password', '-email'])
        res.status(200).json({ doctors, success:true });
    }
    catch (error)
    {
        console.log( error );
        res.status(500).json({ message: error.message, success:false });
    }
}

// API for doctor login 
const loginDoctor = async (req, res) => {

    try
    {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })


        if( !doctor )
        {
            return res.status(200).json({ message: "Doctor not found", success:false });
        }

        const isMatch = await bcrypt.compare( password, doctor.password  )

        if( isMatch )
        {
            const token = jwt.sign( { id: doctor._id}, process.env.JWT_SECRET )

            res.status( 200 ).json({ success: true, message: "Authentication successful", token });
        }
        else 
        {
            return res.status(200).json({ message: "Invalid credentials", success:false });
        }

    }
    catch (error)
    {
        res.status(500).json({ message: error.message, success:false });

        console.log( error );
    }
}

// API to get doctor appointments for doctor pannel 
const appointmentsDoctor = async (req, res) => {

    try
    {
        const { docId } = req.body

        const appointments = await appointmentModel.find( { docId } );

        if( appointments.length == 0 )
        {
            return res.status(200).json({ message: "No appointments found", success:false, appointments });
        }

        res.status(200).json({ appointments, success:true });
        
    }
    catch (error)
    {
        console.log( error );
        res.status(500).json({ message: error.message, success:false });
    }
}

// API to mark completed for appointment 
const appointmentComplete = async (req, res) => {

    try
    {
        const { docId, appointmentId } = req.body 

        const appointmentData = await appointmentModel.findById( appointmentId )

        if( appointmentData && appointmentData.docId == docId )
        {
            await appointmentModel.findByIdAndUpdate( appointmentId, { isCompleted: true })
            return res.status(200).json({ success: true, message: 'Appointment Completed' })
        }
        else 
        {
            return res.status(200).json({ success: false, message: 'Mark Failed' })
        }


    }
    catch (error)
    {
        console.log( error )
        res.status(500).json({ message: error.message, success:false });
    }
}

// API to cancel doctor appointments 
const appointmentCancel = async (req, res) => {

    try
    {
        const { docId, appointmentId } = req.body 

        const appointmentData = await appointmentModel.findById( appointmentId )

        if( appointmentData && appointmentData.docId == docId )
        {
            await appointmentModel.findByIdAndUpdate( appointmentId, { cancelled: true })
            return res.status(200).json({ success: true, message: 'Appointment Cancelled Successfully' })
        }
        else 
        {
            return res.status(200).json({ success: false, message: 'Appointment Cancelled Failed' })
        }


    }
    catch (error)
    {
        console.log( error )
        res.status(500).json({ message: error.message, success:false });
    }
}

// API to get dashboard data for doctor 
const doctorDashboard = async (req, res) => {

    try
    {
        const { docId } = req.body 

        const appointments = await appointmentModel.find( { docId } )

        // find the total earning of doctor 
        let earning = 0

        appointments.map( (item, index) => {

            if( item.isCompleted || item.payment )
            {
                earning += item.amount
            }
        })

        // find the total unqiue patients 
        let patients = []

        appointments.map( (item, index) => {

            if( !patients.includes( item.userId ))
            {
                patients.push( item.userId )
            }
        })

        const dashData = {
            appointment : appointments.length,
            earning,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice( 0, 5)
        }

        res.status(200).json({ success:true, dashData })


    }
    catch (error) {
        console.log( error )
        res.status(500).json({ success:false, message: error.message })
    }
}

// get doctor profile data 
const getDoctorProfile = async (req, res) => {

    try
    {
        const { docId } = req.body 

        const doctorData = await doctorModel.findById( docId ).select('-password')

        res.status(200).json({ success:true, doctorData })


    }
    catch (error) {
        console.log( error )
        res.json({ success:false, message: error.message })
    }
}



export {  changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, getDoctorProfile };