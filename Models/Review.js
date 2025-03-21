const Joi = require("joi");
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId:
    {
      type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
  productId:
    {
      type: mongoose.Schema.Types.ObjectId, ref: "Product"
    },
    rating:
    {
      type: Number,
      required: true,
      min:1,
      max:5
    },
    comment:
    {
      type:String,
    },
    createAt:
    {
      type:Date,
      default:Date.now
    }
},{
  timestamps:true
})

const Review = mongoose.model('reviews',reviewSchema) 

function validateCreateReview(obj) {
  const schema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string(),
  })
  return schema.validate(obj)
}
function validateUpdateReview(obj) {
  const schema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string(),
  })
  return schema.validate(obj)
}

module.exports = {
  Review,
  validateCreateReview,
  validateUpdateReview
}