import jwt from 'jsonwebtoken'

/**
 *  Verify the json web token for the admin 
 * then only we give access to further api 
 * read and write data from DB
 */

// doctor authentication middleware 
const authDoctor = async(req, res, next) => {
    try 
    {
        const { dtoken } = req.headers;

        if( !dtoken )
        {
            return res.status(200).json({msg: "Invalid Authentication", success: false})
        }

        // decrypt the token
        const token_decode = jwt.verify( dtoken, process.env.JWT_SECRET )

        req.body.docId = token_decode.id;

        next(); // Call the next middleware or api function
    }
    catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

export default authDoctor;