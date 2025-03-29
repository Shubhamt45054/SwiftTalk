import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {genereateToken} from '../utils/generateToken.js';
import cloudinary from "../utils/cloudinary.js";

export const signup= async (req, res) => {   

    const {fullName,email,password} = req.body;

    try{

        if(email.trim().length === 0){
            return res.status(400).json({message : "Email is required"});
        }
        if(fullName.trim().length === 0){
            return res.status(400).json({message : "Name is required"});
        }
        if(password.trim().length < 6){
            return res.status(400).json({message : "Password must be atleast 6 characters long"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message : "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password:hashedPassword
        });
        
        if(newUser){
            // jwt token generate 
            genereateToken(newUser._id,res);
            await newUser.save();

            return res.
            status(201).
            json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic,
                message : "User Created Successfully"
            });
        }
        else{
            return res.status(400).json({message : "Invalid User Data"});
        }

    }
    catch(error){
        console.log("Error in signup controller",error);
        res.status(500).json({message : "Internal Server Error"});
    }
} 

export const login = async (req, res) => {
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            // no telling which one is wrong for security reasons
            return res.status(400).json({message : "Invalid Credentials"});
        }
        const matchPassword = await bcrypt.compare(password, user.password);

        if(!matchPassword){
            return res.status(400).json({message : "Invalid Credentials"});
        }
        
        genereateToken(user.id,res);
        // now res cookie have token 

        return res.
        status(200).
        json(user);
    }
    catch(error){
        console.log("Error in login controller",error);
        res.
        status(500).
        json({message : "Internal Server Error"});
    }
}

export const logout =  (req, res) => {
    
    try{
        res.cookie("jwtToken","",{maxAge : 0});
        return res.
        status(200).
        json({message : "User Logged Out Successfully"});
    }
    catch(error){
        console.log("Error in logout controller",error);
        res.
        status(500).
        json({message : "Internal Server Error"});
    }
  }

export const updateProfile = async (req, res) => {
    try{
        const{ profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message : "Profile Pic is required"});
        }
        
        const uploadRespose = await cloudinary.uploader.upload(profilePic);

        const updateUser = await User.findByIdAndUpdate(userId,{ profilePic : uploadRespose.secure_url},{new : true});
        
        res.status(200).json(updateUser);
    }
    catch(error){
        console.log("Error in updateProfile controller",error);
        res.
        status(500).
        json({message : "Internal Server Error"});
    }
}

export const checkAuth = async (req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        console.log("Error in checkAuth controller",error);
        res.
        status(500).
        json({message : "Internal Server Error"});
    }
}