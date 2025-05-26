const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");

const productsRouter = require("./routers/products.router");
const cartsRouter = require("./routers/carts.router");
const viewsRouter = require("./routers/views.router");

const app = express();

// Configuración del motor de plantillas Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views")); // Apunta a /src/views

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Para JS y CSS del frontend

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas de vistas
app.use("/", viewsRouter);

module.exports = app;
