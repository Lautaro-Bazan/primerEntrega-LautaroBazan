//carts.controller.js
const Cart = require("../models/cart.model");

exports.deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).send("Carrito no encontrado");

  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
  res.send(cart);
};

exports.updateCart = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
  res.send(cart);
};

exports.updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findById(cid);
  const product = cart.products.find(p => p.product.toString() === pid);
  if (!product) return res.status(404).send("Producto no encontrado");
  product.quantity = quantity;
  await cart.save();
  res.send(cart);
};

exports.clearCart = async (req, res) => {
  const { cid } = req.params;
  const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
  res.send(cart);
};

exports.getCartWithProducts = async (req, res) => {
  const { cid } = req.params;
  const cart = await Cart.findById(cid).populate("products.product");
  res.render("cartView", { cart });
};
