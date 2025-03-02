import jwt from 'jsonwebtoken'

/**
 *  Verify the json web token for the admin 
 * then only we give access to further api 
 * read and write data from DB
 */

// user authentication middleware 
const authUser = async(req, res, next) => {
    try 
    {
        const { token } = req.headers;

        if( !token )
        {
            return res.status(200).json({msg: "Invalid Authentication", success: false})
        }

        // decrypt the token
        const token_decode = jwt.verify( token, process.env.JWT_SECRET )

        req.body.userId = token_decode.id
        // handle this userId in a controller 

        next(); // Call the next middleware or api function
    }
    catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

export default authUser;