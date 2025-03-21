const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    regularPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    SKU: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    accessoriesImage: [
      {
        type: Object,
        default: {
          url: "",
          publicId: null,
        },
      },
    ],
    size: [],
    color: [],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

productSchema.virtual("orders", {
  ref: "Order",
  foreignField: "productId",
  localField: "_id",
});

productSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField : "productId",
  localField: "_id",
})

function validateCreateProduct(obj) {
  const schema = Joi.object({
    image: Joi.object({
      url: Joi.string().uri().optional(),
      publicId: Joi.string().optional(),
    }).optional(),
    name: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().min(3).max(100).required(),
    category: Joi.string().trim().required(),
    brandName: Joi.string().trim().min(3).max(100).required(),
    regularPrice: Joi.number().min(0).required(),
    salePrice: Joi.number()
      .min(0)
      .required()
      .less(Joi.ref("regularPrice"))
      .messages({
        "number.less": `"salePrice" يجب أن يكون أقل من "regularPrice"`,
      }),
    stockQuantity: Joi.number().min(0).required(),
    SKU: Joi.string().trim().min(3).max(100).required(),
    size: Joi.array()
      .items(Joi.string().required())
      .required(),
    color: Joi.array()
      .items(
        Joi.string().required()
      )
      .required(),
  });
  return schema.validate(obj);
}

function validateUpdateProduct(obj) {
  const schema = Joi.object({
    image: Joi.object({
      url: Joi.string().uri().optional(),
      publicId: Joi.string().optional(),
    }).optional(),
    name: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().min(3).max(100),
    category: Joi.string().trim(),
    brandName: Joi.string().trim().min(3).max(100),
    regularPrice: Joi.number().min(0),
    salePrice: Joi.number().min(0).less(Joi.ref("regularPrice")).messages({
      "number.less": `"salePrice" يجب أن يكون أقل من "regularPrice"`,
    }),
    stockQuantity: Joi.number().min(0),
    SKU: Joi.string().trim().min(3).max(100),
    size: Joi.array().items(Joi.string()),
    color: Joi.array().items(
      Joi.string()
    ),
  });
  return schema.validate(obj);
}

module.exports = {
  Product,
  validateCreateProduct,
  validateUpdateProduct,
};

