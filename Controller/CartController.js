const asyncHandler = require("express-async-handler");
const {Cart, validateAddToCart, validateUpdateCartItem} = require("../Models/Cart");
const { Product } = require("../Models/Product");

/**
 * @desc Add Item to Cart
 * @route POST /api/cart
 * @access Private (User)
 */
module.exports.addToCart = asyncHandler(async (req, res) => {
  const { error } = validateAddToCart(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  // if (!req.user?._id) {
  //   return res.status(401).json({
  //     success: false,
  //     message: "Not authorized, user not found"
  //   });
  // }
  const product = await Product.findById(req.body.product);
  if (!product) return res.status(404).json({ message: "Product not found" });
  let cart = await Cart.findOne({ user: req.user._id });
  console.log(cart);

  const item = {
    product: req.body.product,
    quantity: req.body.quantity,
    size: req.body.size,
    price: product.salePrice
  };

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [item],
      total: req.body.quantity * product.salePrice
    });
  } else {
    cart.items.push(item);
    cart.total += req.body.quantity * product.salePrice;
    await cart.save();
  }

  res.status(201).json(cart);
});

/**
 * @desc Get Cart
 * @route GET /api/cart
 * @access Private (User)
 */
module.exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  res.status(200).json(cart);
});

/**
 * @desc Update Cart Item
 * @route PUT /api/cart/item/:itemId
 * @access Private (User)
 */
module.exports.updateCartItem = asyncHandler(async (req, res) => {
  const { error } = validateUpdateCartItem(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Cart item not found" });

  const product = await Product.findById(item.product);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.body.quantity) {
    item.quantity = req.body.quantity;
  }
  if (req.body.size) {
    item.size = req.body.size;
  }

  item.price = product.price;

  cart.total = cart.items.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);

  await cart.save();
  res.status(200).json(cart);
}); 

/**
 * @desc Delete Item from Cart
 * @route DELETE /api/cart/item/:itemId
 * @access Private (User)
 */
module.exports.deleteCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Cart item not found" });

  item.remove();

  cart.total = cart.items.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);
  await cart.save();

  res.status(200).json({ message: "Item removed from cart", cart });
});

/**
 * @desc Clear Cart
 * @route DELETE /api/cart
 * @access Private (User)
 */
module.exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(200).json({ message: "Cart cleared" });
});
