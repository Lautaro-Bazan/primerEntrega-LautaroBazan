const fs = require("fs").promises;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id == id);
  }

  async addProduct(data) {
    if (!data.title || isNaN(data.price)) {
      throw new Error("Producto inválido");
    }

    const products = await this.getProducts();
    const id = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const product = { id, status: true, ...data };
    products.push(product);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return product;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id == id);
    if (index === -1) return null;
    products[index] = {
      ...products[index],
      ...updates,
      id: products[index].id,
    };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const newProducts = products.filter((p) => p.id != id);
    if (products.length === newProducts.length) return null;
    await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
    return true;
  }
}

module.exports = ProductManager;
