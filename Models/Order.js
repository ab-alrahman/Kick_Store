const Joi = require("joi");
const mongoose = require('mongoose');

// models/Order.js
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: Number,
    size: String,
    price: Number
}],
    total: {
        type: Number,
        required: true
},
    shippingAddress: {
        street: String,
        city: String,
        country: String,
        postalCode: String
},
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'cash_on_delivery','MTN_CASH','SYR_CASH'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    } 
});

const Order = mongoose.model('Order', orderSchema);
// Joi Validations

// Create Order
function validateCreateOrder(obj) {
    const schema = Joi.object({
        user: Joi.string().required(),

        items: Joi.array().items(
            Joi.object({
                product: Joi.string().required(),
                quantity: Joi.number().min(1).required(),
                size: Joi.string().required(),
                price: Joi.number().min(0).required()
            })
        ).min(1).required(),

        total: Joi.number().min(0).required(),

        shippingAddress: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            postalCode: Joi.string().required()
        }).required(),

        paymentMethod: Joi.string()
            .valid("credit_card", "paypal", "cash_on_delivery","MTN_CASH","SYR_CASH")
            .required()
    });

    return schema.validate(obj);
}


// Update Order
function validateUpdateOrder(obj) {
    const schema = Joi.object({
        items: Joi.array().items(
            Joi.object({
                product: Joi.string(),
                quantity: Joi.number().min(1),
                size: Joi.string(),
                price: Joi.number().min(0)
            })
        ),

        total: Joi.number().min(0),

        shippingAddress: Joi.object({
            street: Joi.string(),
            city: Joi.string(),
            country: Joi.string(),
            postalCode: Joi.string()
        }),

        paymentMethod: Joi.string()
            .valid("credit_card", "paypal", "cash_on_delivery","MTN_CASH","SYR_CASH")
    });

    return schema.validate(obj);
}


// Update Order Status
function validateUpdateStatusOfOrder(obj) {
    const schema = Joi.object({
        status: Joi.string()
            .valid("pending", "processing", "shipped", "delivered", "cancelled")
            .required()
    });

    return schema.validate(obj);
}


module.exports = {
    Order,
    validateCreateOrder,
    validateUpdateOrder,
    validateUpdateStatusOfOrder,
};
