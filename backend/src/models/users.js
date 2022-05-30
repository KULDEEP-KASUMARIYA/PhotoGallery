const mongoose = require("mongoose");
const validator = require("validator");

const usersSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique : true
    },
    password:{
        type:String,
        required:true,
        select : true
    },
    name :{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        
    },
    city :{
        type:String,
        
    },
    dob :{
        type:Date,
        
    },
    image:{
        type:String,
    },
    provider_id : {
        type:String
    },
    provider_name  : {
        type :String
    },
    status :{
        type : Number,
        default: 1,
    },
    role :{
        type: String,
        required:true,
        default : 'user'
    }
})

const User = new mongoose.model('User',usersSchema);
module.exports = User;