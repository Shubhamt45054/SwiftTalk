import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try{
        // console.log(res.cookies);
        const token = req.cookies.jwtToken;

        if(!token){
            return res.status(401).json({message:"unaurthorized acess"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message:"unaurthorized acess"});
        }

        const user = await User.findById(decoded.userID).select("-password");
        if(!user){
            return res.status(401).json({message:"unaurthorized acess"});
        }
        req.user = user;
        // console.log("User",req.user);
        next();
    }
    catch(error){
        console.log("Error in protectRoute middleware",error);
        res.status(500).json({message : "Internal Server Error"});
    }
}