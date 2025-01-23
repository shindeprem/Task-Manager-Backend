const jwt = require("jsonwebtoken");
const constants = require("../constants");
const JWT_SECRET = constants.JWT_SECRET;

const userAuth = async(req,res,next)=>{
    try{
        const token = req.cookies.authToken;
        
        if(!token){
            res.status(401).json({
                message:"access denied"
            })
        }

        const decodedToken = jwt.verify(token,JWT_SECRET)
        
        req.user = {userId:decodedToken.userId}
        next()
    }catch(err){
    }
    
}

module.exports = userAuth;