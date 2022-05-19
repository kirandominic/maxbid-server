const mongoose = require("mongoose")
const bidSchema= new mongoose.Schema({
    pid:{
        type: String,
        required :true,
    },
    bid:{
        type: Number,
        required :true,
    },
    uid:{
        type : String,
        required :true,
    },
    name:{
        type : String,
        required :true,
    },
    date: {type:Date,
        default: new Date},
});

const BidModel = mongoose.model("bids",bidSchema)
module.exports = BidModel;