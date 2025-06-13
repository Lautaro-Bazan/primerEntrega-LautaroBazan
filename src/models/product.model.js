//product.model.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  status: { type: Boolean, default: true },
  code: { type: String, unique: true },
  stock: Number,
  category: String,
});

module.exports = mongoose.model("Product", productSchema);
