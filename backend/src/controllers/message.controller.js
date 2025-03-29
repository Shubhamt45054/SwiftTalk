import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import {getReceiverSocketId,io} from "../utils/socket.js"

export const getUsersforSidebar = async (req, res) => {

    try{
        // console.log(req.user);
        const loggedUser = req.user._id;
        // not equal to logged in user
        const filterUsers = await User.find({ _id: { $ne: loggedUser } }).select("-password");

        res.status(200).json(filterUsers);
    }
    catch(error){
        console.log("Error in getting users for sidebar",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const getMessages = async (req, res) => {
   try{ const {id : otherId} = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: otherId },
            { senderId: otherId, receiverId: myId },
        ],
    })

    return res.status(200).json(messages);
  }
  catch(error){
    console.log("Error in getting messages",error.message);
    res.status(500).json({message:"Internal server error"});
  }
};

export const sendMessage = async (req, res) => {
    
    try{
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const { text,image} = req.body;

        let imageUrl = "";
        console.log("Hello");
        console.log(image);
        if(image){
            // upload 64base image to cloudinaray
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });

        // saving data to userBase...
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
       
        if(receiverSocketId){
            // broadcasting to user only....
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(200).json(newMessage);
    }
    catch(error){
        console.log("Error in sending message",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}