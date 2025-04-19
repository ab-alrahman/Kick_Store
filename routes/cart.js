const express = require("express");
const router = express.Router();
const { addToCart, clearCart, deleteCartItem, getCart, updateCartItem } = require("../Controller/CartController");
const {verifyAuthorization,verifyToken,verifyAdmin} = require('../middlewares/verifyToken');
const protect = require("../middlewares/protect");
router.route("/")
  .post(verifyToken,addToCart)
  .get(verifyToken,getCart);
router.delete("/:productId", deleteCartItem);
router.route("/:id").delete(clearCart).put(updateCartItem); 

module.exports = router;
