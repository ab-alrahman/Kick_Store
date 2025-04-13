const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: v => /^[0-9]{10}$/.test(v),
        message: props => `${props.value} is not a valid 10-digit phone number!`,
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    code: {
      type: Number,
      default: 0,
    },
    isOk: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

function validateRegisterUser(obj) {
  const schema = Joi.object({
      image: Joi.object({
          url: Joi.string().uri().optional(),
          publicId: Joi.string().optional(),
        }).optional(),
    firstName: Joi.string().trim().min(2).max(200).required(),
    lastName: Joi.string().trim().min(2).max(200).required(),
    email: Joi.string().trim().min(5).max(100).required().email(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    password: Joi.string().trim().min(6).required(),
    isAdmin: Joi.boolean().optional().default(false), 
  });
  return schema.validate(obj);
}

function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}
// Update User
function validateUpdaterUser(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(2).max(200),
    lastName: Joi.string().trim().min(2).max(200),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
  });
  return schema.validate(obj);
}

// Validate Code
function validateCode(obj) {
  const schema = Joi.object({
    code: Joi.number().min(6).required(),
  });
  return schema.validate(obj);
}

// Validate Change Password
function validateChangePassword(obj) {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateLoginUser,
  validateRegisterUser,
  validateChangePassword,
  validateCode,
  validateUpdaterUser
};
