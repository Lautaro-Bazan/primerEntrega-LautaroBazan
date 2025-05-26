const express = require("express");
const router = express.Router();
const path = require("path");
const ProductManager = require("../managers/ProductManager");

const productManager = new ProductManager(
  path.join(__dirname, "../db/products.json")
);

// Vista principal con productos (modo estático)
router.get("/home", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", {
    title: "Inicio",
    products,
  });
});

// Vista en tiempo real con productos + WebSocket
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", {
    title: "Productos en tiempo real",
    products,
  });
});

module.exports = router;
