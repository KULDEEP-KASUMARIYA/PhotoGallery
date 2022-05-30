const mongoose = require("mongoose");
const validator = require("validator");

const productsSchema = new mongoose.Schema({
    catName : {
        type : String,
        required : true,
    },
    proName:{
        type : String,
        unique : true,
        required :true
    },
    proQty :{
        type:Number,
        required : true
    },
    proPrice :{
        type:Number,
        required: true
    },
    proImage:{
        type : String,
        required : true
    }
})

const Products = new mongoose.model('Products',productsSchema)
module.exports = Products