const mongoose = require("mongoose")
const UserSchema= new mongoose.Schema({
    fname:{
        type: String,
        required :true,
    },
    lname:{
        type: String,
        required :true,
    },
    phone:{
        type : Number,
        required:true,
        minlength:10,
    },
    address:{
        type : String,
        required:true,
    },
    // district:{
    //     type : String,
    // },
    // state:{
    //     type : String,
    // },
    email:{
        type : String,
    },
    password:{
        type : String,
        minlength:8,
        maxlength:16,
    },
    id:{
        type : String
    },
    profile:{
        type : String
    },
    status:{
        type : String,
        default:'un_approved'
    },
    otp:{
        type:Number,
    },
});

const UserModel = mongoose.model("users",UserSchema)
module.exports = UserModel;