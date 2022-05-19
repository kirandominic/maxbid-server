const mongoose = require("mongoose")
const paymentSchema= new mongoose.Schema({
    pid:{
        type: String,
        required :true,
    },
    uid:{
        type: String,
        required :true,
    },
    username:{
        type: String,
        required :true,
    },
    productname:{
        type: String,
        required :true,
    },
    amount:{
        type: String,
        required :true,
    },
    days:{
        type: String,
        required :true,
    },
    
    date: {type:Date,
        default: new Date},
});

const PaymentModel = mongoose.model("payment",paymentSchema)
module.exports = PaymentModel;