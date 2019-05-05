// Developer : Aditya Gadhvi (B00809664)
// This file will basically authenticate the stored token of the logged in user.
const jwt=require("jsonwebtoken");

module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        jwt.verify(token,"secret_secret_secret_secret_secret");
        next();
    }
    catch(errror){
        res.status(401).json({message:"Auth failed"});
    }
};