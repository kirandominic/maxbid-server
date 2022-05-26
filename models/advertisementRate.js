const mongoose = require("mongoose")
const rateschema= new mongoose.Schema({
    
    rate:{
        type : Number,
        required :true,
    },
    date: {type:Date,
        },
});

const RateModel = mongoose.model("rate",rateschema)
module.exports = RateModel;