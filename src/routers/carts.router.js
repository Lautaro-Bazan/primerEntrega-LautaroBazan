//carts.router.js
const express = require("express");
const {
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart,
  getCartWithProducts
} = require("../controllers/carts.controller");

const router = express.Router();

router.delete("/:cid/products/:pid", deleteProductFromCart);
router.put("/:cid", updateCart);
router.put("/:cid/products/:pid", updateProductQuantity);
router.delete("/:cid", clearCart);
router.get("/:cid", getCartWithProducts);

module.exports = router;
