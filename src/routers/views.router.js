const express = require("express");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

const router = express.Router();

// Vista de productos con paginación, filtro y orden
router.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;
    const query = req.query.query || null;

    let filter = {};
    if (query) {
      if (query.toLowerCase() === "available" || query.toLowerCase() === "true") {
        filter.status = true;
      } else if (query.toLowerCase() === "unavailable" || query.toLowerCase() === "false") {
        filter.status = false;
      } else {
        filter.category = query;
      }
    }

    const totalDocs = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);
    const skip = (page - 1) * limit;

    let productsQuery = Product.find(filter).skip(skip).limit(limit);
    if (sort) productsQuery = productsQuery.sort({ price: sort });
    const products = await productsQuery.lean();

    const baseUrl = "/products";
    const buildLink = (pageNum) =>
      pageNum > 0 && pageNum <= totalPages
        ? `${baseUrl}?limit=${limit}&page=${pageNum}${sort ? `&sort=${req.query.sort}` : ""}${query ? `&query=${query}` : ""}`
        : null;

    res.render("home", {
      title: "Productos",
      products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: buildLink(page - 1),
      nextLink: buildLink(page + 1),
      query,
      sort,
      limit,
    });
  } catch (err) {
    res.status(500).send("Error al obtener productos");
  }
});

// Vista de un carrito
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cartView", { cart });
  } catch (err) {
    res.status(500).send("Error al obtener el carrito");
  }
});

module.exports = router;

