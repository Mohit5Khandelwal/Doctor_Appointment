import jwt from 'jsonwebtoken'

/**
 *  Verify the json web token for the admin 
 * then only we give access to further api 
 * read and write data from DB
 */

// admin authentication middleware 
const authAdmin = async(req, res, next) => {
    try 
    {
        const { atoken } = req.headers;

        if( !atoken )
        {
            return res.status(200).json({msg: "Invalid Authentication", success: false})
        }

        // decrypt the token
        const token_decode = jwt.verify( atoken, process.env.JWT_SECRET )

        if( token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD )
        {
            return res.status(200).json({msg: "Invalid Authentication Login Again", success: false})
        }

        next(); // Call the next middleware or api function
    }
    catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

export default authAdmin;