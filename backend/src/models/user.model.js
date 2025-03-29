import mongoose from "mongoose";

// its a schema for user
const userSchema = new mongoose.Schema({
    email :{
        type : String,
        required : true,
        unique : true,
    },
    fullName : {
        type : String,
        required : true,
    },
    password :{
        type:String,
        required : true,
        minlength : 6,
    },
    profilePic : {
        type : String,
        default : "",
    }
},
{
    timestamps : true,
});

// creating the model/ (u)
const User = mongoose.model('User',userSchema);

export default User;

