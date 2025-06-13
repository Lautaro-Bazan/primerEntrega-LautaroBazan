const Product = require("../models/product.model");

exports.getProducts = async (req, res) => {
  try {
    // Obtener query params con valores por defecto
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;
    const query = req.query.query || null;

    // Construir filtro para categoría o disponibilidad (status)
    let filter = {};
    if (query) {
      // Si el query es 'available' o 'true', filtro por status true
      if (query.toLowerCase() === "available" || query.toLowerCase() === "true") {
        filter.status = true;
      } else if (query.toLowerCase() === "unavailable" || query.toLowerCase() === "false") {
        filter.status = false;
      } else {
        // Si no, asumimos que es categoría (match exacto)
        filter.category = query;
      }
    }

    // Opciones para paginación y sort
    let options = {
      limit,
      page,
      lean: true,
    };
    if (sort) options.sort = { price: sort };

    // Ejecutar paginación con mongoose-paginate-v2 (si no la tienes, podemos hacerlo manual)
    // Aquí hago el manual con skip y limit para no añadir dependencia extra
    const totalDocs = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);
    const skip = (page - 1) * limit;

    let productsQuery = Product.find(filter).skip(skip).limit(limit);
    if (sort) productsQuery = productsQuery.sort({ price: sort });
    const products = await productsQuery.lean();

    // Construir links de paginación (suponiendo que la ruta base es /products)
    const baseUrl = req.baseUrl + req.path; // o simplemente '/products'
    const buildLink = (pageNum) => 
      pageNum > 0 && pageNum <= totalPages
        ? `${baseUrl}?limit=${limit}&page=${pageNum}${sort ? `&sort=${req.query.sort}` : ""}${query ? `&query=${query}` : ""}`
        : null;

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: buildLink(page - 1),
      nextLink: buildLink(page + 1),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
exports.addProduct = async (req, res) => {
  try {
    const { title, description, price, category, status, code, stock, thumbnails } = req.body;

    if (!title || !description || !price || !category || !code || stock == null) {
      return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      status: status !== undefined ? status : true,
      code,
      stock,
      thumbnails,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ status: "success", payload: savedProduct });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};


