const Joi = require("joi");
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId:
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
    },
  productId:
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required:true
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
  image: {
    type: Object,
    default: {
      url: "",
      publicId: null,
    },
  }
},{
  timestamps:true
})

const Review = mongoose.model('reviews',reviewSchema) 

function validateCreateReview(obj) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string(),
  })
  return schema.validate(obj)
}
function validateUpdateReview(obj) {
  const schema = Joi.object({
    productId: Joi.string().required(),
    rating: Joi.number().min(1).max(5),
    comment: Joi.string(),
  })
  return schema.validate(obj)
}

module.exports = {
  Review,
  validateCreateReview,
  validateUpdateReview
}