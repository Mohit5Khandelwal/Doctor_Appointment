import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModels.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary} from 'cloudinary'


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

        res.status(200).json({ success:true, data: userData })
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




export { registerUser, loginUser, getProfile, updateProfile }