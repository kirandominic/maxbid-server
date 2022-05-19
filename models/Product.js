const mongoose = require("mongoose")
const ProductSchema= new mongoose.Schema({
    id:{
        type: String,
        default:'id'
    },
    pname:{
        type: String,
        required :true,
    },
    bid:{
        type: Number,
        required :true,
    },
    high_bid:{
        type: Number,
        default: 0,
    },
    days:{
        type : Number,
        required:true,
    },
    location:{
        type : String,
        required:true,
    },
    information:{
        type : String,
    },
    image:{
        type : String,
    },
    status:{
        type : String,
        default:'approved'
    },
    promostatus:{
        type : String,
        default:'inactive'
    },

    
    expired:{
        type : String,
        default:'no'
    },
    winner:{
        type : String,
        default: 'none'
    },
    date: {type:Date,
        default: new Date},
        email:{
            type : String,
        },
});

const ProductModel = mongoose.model("products",ProductSchema)
module.exports = ProductModel;