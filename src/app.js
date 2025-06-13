const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { engine } = require("express-handlebars");
require("./config/db");

const productsRouter = require("./routers/products.router");
const cartsRouter = require("./routers/carts.router");
const viewsRouter = require("./routers/views.router");  // Importar el router de vistas

const app = express();

app.engine(
  "handlebars",
  engine({
    helpers: {
      eq: (a, b) => a === b,
    },
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);  // Montar router de vistas en /

module.exports = app;
