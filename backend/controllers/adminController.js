import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';

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
            return res.status(400).json({ success:false, message: "All fields are required" })
        }

        // validating email format 
        if( !validator.isEmail( email ))
        {
            return res.status(400).json({ success:false, message: "Invalid email format" })
        }

        // validating password length
        if( password.length < 6 )
        {
            return res.status(400).json({ success:false, message: "Password must be atleast 6 characters" })
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
            return res.status(400).json({ success:false, message: "Invalid credentials" })
        }

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ success:false, message: "Internal server error" })
    }

}

export { addDoctor, loginAdmin}