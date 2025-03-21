const Joi = require("joi")
const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
    product: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true
    },
    payMethod : {
        type : String ,
        trim : true ,
        minlength : 3 ,
        maxlength : 30
    },
    customerName : {
        type : String ,
        ref :  "user"
    },
    status : {
        type : String ,
        enum : ["delivered","canceled","under delivery"],
        default : "under delivery"
    },
    amount : {
        type : Number ,
        minlength : 1 ,
        require : true ,
    },
    total : {
        type : Number

    }
},{timestamps:true})

const Order = mongoose.model("Order" , orderSchema)




//Validate Create Order
function validateCreateOrder(obj) {
    const Schema = Joi.object({
        product : Joi.string().required(), 
        payMethod : Joi.string().trim().required() ,
        amount : Joi.string().min(1).required()
    })
    return Schema.validate(obj)
} 

//Validate Update Order
function validateUpdateOrder(obj) {
    const Schema = Joi.object({
        product : Joi.string(), 
        payMethod : Joi.string().trim(),
        amount : Joi.string().min(1)
    })
    return Schema.validate(obj)
}

//Validate Create Order
function validateUpdateStauOfOrder(obj) {
    const Schema = Joi.object({
        status : Joi.string().required(),
    })
    return Schema.validate(obj)
} 


module.exports = {
    Order ,
    validateCreateOrder ,
    validateUpdateStauOfOrder ,
    validateUpdateOrder
}