import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


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

export {  changeAvailability, doctorList, loginDoctor };