const fs = require("fs").promises;

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((c) => c.id == id);
  }

  async createCart() {
    const carts = await this.getCarts();
    const id = carts.length ? Math.max(...carts.map((c) => c.id)) + 1 : 1;
    const newCart = { id, products: [] };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id == cid);
    if (!cart) return null;
    const existing = cart.products.find((p) => p.product == pid);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

module.exports = CartManager;
