const mongoose = require("mongoose")
const Joi = require("joi")

// Category Schema
const CategorySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true,
        trim : true
    },
    image : {
        type : Object ,
        default : {
            url : "" ,
            publicId : null
        }
    },
}, {
    timestamps : true, 
})
// Category Model
const Category = mongoose.model("Category" , CategorySchema)

//Validate Create Category
function validateCreateCategory(obj) {
    const Schema = Joi.object({
        name : Joi.string().trim().required()
    })
    return Schema.validate(obj)
} 
module.exports = {
    Category,
    validateCreateCategory 
}
