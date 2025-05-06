const CartManager = require("../managers/CartManager");
const path = require("path");
const cartManager = new CartManager(path.join(__dirname, "../db/carts.json"));

const createCart = async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
};

const getCartById = async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartManager.getCartById(cid);
  cart
    ? res.json(cart.products)
    : res.status(404).json({ error: "Carrito no encontrado" });
};

const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const result = await cartManager.addProductToCart(cid, pid);
  result
    ? res.json(result)
    : res.status(404).json({ error: "Error al agregar producto al carrito" });
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
};
