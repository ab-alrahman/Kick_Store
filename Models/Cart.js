
const mongoose = require('mongoose');
const Joi = require("joi");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  size: {
    type: String,
    required: true
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Cart = mongoose.model('Cart', cartSchema);


function validateAddToCart(obj) {
  const schema = Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    size: Joi.string().required(),
  });

  return schema.validate(obj);
}

function validateUpdateCartItem(obj) {
  const schema = Joi.object({
    quantity: Joi.number().min(1),
    size: Joi.string(),
  });

  return schema.validate(obj);
}

module.exports = {
  Cart,
  validateAddToCart,
  validateUpdateCartItem
};
