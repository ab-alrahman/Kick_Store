const asyncHandler = require("express-async-handler");
const {
  Order,
  validateCreateOrder,
  validateUpdateStatusOfOrder,
  validateUpdateOrder
} = require("../Models/Order");
const { User } = require("../Models/User");
const { Product } = require("../Models/Product");
const { isBefore, addHours } = require("date-fns");

/**
 * @desc Create New Order
 * @route POST /api/order
 * @access Public
 */
module.exports.createOrder = asyncHandler(async (req, res) => {
  const { error } = validateCreateOrder(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findById(req.body.user);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Validate products in items
  for (const item of req.body.items) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
  }

  const order = await Order.create({
    user: req.body.user,
    items: req.body.items,
    total: req.body.total,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod
  });

  res.status(201).json(order);
});

/**
 * @desc Get All Orders
 * @route GET /api/order
 * @access Private (admin only)
 */
module.exports.getAllOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "title salePrice");
    res.status(200).json(orders);
});

/**
 * @desc Get Order By ID
 * @route GET /api/order/:id
 * @access Private (admin only)
 */
module.exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "title salePrice")
    .lean();

  if (!order) return res.status(404).json({ message: "Order not found" });

  res.status(200).json({ success: true, data: order });
});

/**
 * @desc Update Order
 * @route PUT /api/order/:id
 * @access Private (user)
 */
module.exports.updateOrder = asyncHandler(async (req, res) => {
  const { error } = validateUpdateOrder(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const oneHourLater = addHours(order.createdAt, 1);
  if (!isBefore(new Date(), oneHourLater)) {
    return res.status(403).json({ message: "You cannot update this order after one hour" });
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  res.status(200).json(updatedOrder);
});

/**
 * @desc Delete Order
 * @route DELETE /api/order/:id
 * @access Private (user)
 */
module.exports.deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const oneHourLater = addHours(order.createdAt, 1);
  if (!isBefore(new Date(), oneHourLater)) {
    return res.status(403).json({ message: "You cannot delete this order after one hour" });
  }

  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Order has been deleted successfully", orderId: order._id });
});

/**
 * @desc Update Status of Order
 * @route PUT /api/order/status/:id
 * @access Private (admin only)
 */
module.exports.updateStatus = asyncHandler(async (req, res) => {
  const { error } = validateUpdateStatusOfOrder(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

  res.status(200).json(updatedOrder);
});

/**
 * @desc Get Order Count
 * @route GET /api/order/count
 * @access Private (admin only)
 */
module.exports.getOrderCount = asyncHandler(async (req, res) => {
  const count = await Order.countDocuments();
  res.status(200).json({ count });
});

/**
 * @desc Get Orders By Status
 * @route GET /api/order/status/:status
 * @access Private (admin only)
 */
module.exports.getOrderStatus = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: req.params.status })
    .populate("user", "name")
    .populate("items.product", "title");
  res.status(200).json(orders);
});
