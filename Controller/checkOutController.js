const asyncHandler = require("express-async-handler");
const { Order } = require('../Models/Order');
const { Cart } = require('../Models/Cart');

module.exports.checkOut = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'السلة فارغة' });
    }

    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        price: item.price
      })),
      total: cart.total,
      shippingAddress,
      paymentMethod
    });

    await order.save();
    await Cart.findByIdAndDelete(cart._id);

    res.status(201).json({
      success: true,
      order,
      message: 'تم إنشاء الطلب بنجاح'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})