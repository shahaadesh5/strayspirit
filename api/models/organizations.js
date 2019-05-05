//Developer : Aditya Gadhvi (B00809664)

const mongoose = require("mongoose");
//const uniqueValidator=require("mongoose-unique-validator");


const organizationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    organizationtName:String,
    email:{type:String, unique:true},
    phoneNumber:Number,
    registrationNumber:Number,
    password:String,
    address:String,
    pinCode:String,
    user_type:String,
    user_creation_date:String
});


//userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Organization", organizationSchema);