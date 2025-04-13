const asyncHandler = require("express-async-handler") 
const { Order , validateCreateOrder, validateUpdateStauOfOrder , validateUpdateOrder } = require("../Models/Order")
const { User } = require("../Models/User")
const { Product } = require("../Models/Product")
const { isBefore, addHours } = require('date-fns')

/**
 * @desc Create New Order
 * @route /api/order
 * @method POST
 * @access puplic
 */
module.exports.createOrder = asyncHandler(async(req,res) =>{
    const {error } = validateCreateOrder(req.body)
    if(error) {
        return res.status(400).json({message : error.details[0].message})
    }
    const product = await Product.findById(req.body.product)
    const user = await User.findById(req.user.id)
    
    // console.log(req.body.product)
    const order = await Order.create({
        product : product.id,
        payMethod : req.body.payMethod,
        customerName : user.firstName ,
        amount : req.body.amount ,
        total :  req.body.amount * product.salePrice
    })
res.status(201).json(order)
})

/**
 * @desc Get All Order
 * @route /api/order
 * @method GET
 * @access private (only admin)
 */
module.exports.getAllOrder = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.body.product)
    const order = await Order.find()
    res.status(200).json({
    details: {
        product: product,
        order : order
    }
})
})


/**
 * @desc Update Order
 * @route /api/order/:id
 * @method PUT
 * @access private (only user)
 */
module.exports.updateOrder = asyncHandler(async (req, res) => {
    const {error} = validateUpdateOrder(req.body)
    if(error) {
    return res.status(400).json({message: error.details[0].message})
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    const oneHourLater = addHours(new Date(order.createdAt), 1);
    if (!(isBefore(new Date(), oneHourLater))) {
        return res.status(403).json({ message: "You cannot update this order after one hour" });
    }

    const updatedorder = await Order.findByIdAndUpdate(req.params.id , {
        $set : {
        product : req.body.product,
        payMethod : req.body.payMethod,
        amount : req.body.amount
        }
    },{new:true});
    res.status(200).json(updatedorder);
},{new:true});

/**
 * @desc Delete Order
 * @route /api/order/:id
 * @method DELETE
 * @access private (only user)
 */
module.exports.deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    const oneHourLater = addHours(new Date(order.createdAt), 1);
    if (!(isBefore(new Date(), oneHourLater))) {
        return res.status(403).json({ message: "You cannot delete this order after one hour" });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: "Order has been deleted successfully",
        categoryId: order._id
    });
});


/**
 * @desc Update Statu of Order
 * @route /api/order/statu/:id
 * @method PUT
 * @access private (only admin)
 */
module.exports.updateStatu =asyncHandler(async(req ,res) =>{
// 1. validation
    const {error} = validateUpdateStauOfOrder(req.body)
    if(error){
        return res.status(400).json({message : error.details[0].message}) 
    }
    const updatedstatu = await Order.findByIdAndUpdate(req.params.id,{
        $set : {
            statu : req.body.statu
        }
    },{new : true})
    res.status(200).json(updatedstatu)
})


/**
 * @desc Get Order Count 
 * @route /api/order/count
 * @method GET
 * @access private (only admim)
 */
module.exports.getOrderCount =asyncHandler(async(req ,res) =>{
    const count = await Order.countDocuments()
    res.status(200).json(count)
})

/**
 * @desc Get Order By status 
 * @route /api/order/status
 * @method GET
 * @access private (only admim)
 */

module.exports.getOrderStatus =asyncHandler(async(req ,res) =>{
    const status = await Order.findOne({status: req.params.status})
    res.status(200).json(status)
})
