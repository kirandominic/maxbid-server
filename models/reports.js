const mongoose = require("mongoose")
const reportSchema= new mongoose.Schema({
    pid:{
        type: String,
        required :true,
    },
    reason:{
        type: String,
        required :true,
    },
    name:{
        type: String,
        required :true,
    },
    status:{
        type : String,
        default:'unchecked'
    },
    date: {type:Date,
        default: new Date},
});

const ReportModel = mongoose.model("reports",reportSchema)
module.exports = ReportModel;