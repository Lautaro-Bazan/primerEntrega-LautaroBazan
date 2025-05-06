const path = require("path");
const ProductManager = require("../managers/ProductManager");
const productManager = new ProductManager(
  path.join(__dirname, "../db/products.json")
);

const getAllProducts = async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
};

const getProductById = async (req, res) => {
  const id = req.params.pid;
  const product = await productManager.getProductById(id);
  product
    ? res.json(product)
    : res.status(404).json({ error: "Producto no encontrado" });
};

const createProduct = async (req, res) => {
  const data = req.body;
  const product = await productManager.addProduct(data);
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const id = req.params.pid;
  const data = req.body;
  const updated = await productManager.updateProduct(id, data);
  updated
    ? res.json(updated)
    : res.status(404).json({ error: "Producto no encontrado" });
};

const deleteProduct = async (req, res) => {
  const id = req.params.pid;
  const deleted = await productManager.deleteProduct(id);
  deleted
    ? res.json({ message: "Producto eliminado" })
    : res.status(404).json({ error: "Producto no encontrado" });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
