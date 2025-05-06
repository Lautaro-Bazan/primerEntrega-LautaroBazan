const express = require("express");
const app = express();

const productsRouter = require("./routers/products.router");
const cartsRouter = require("./routers/carts.router");

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

module.exports = app;
