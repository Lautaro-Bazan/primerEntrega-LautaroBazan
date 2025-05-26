const app = require("./src/app");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const ProductManager = require("./src/managers/ProductManager");

const productManager = new ProductManager(
  path.join(__dirname, "src/db/products.json")
);

const server = http.createServer(app);
const io = new Server(server);

const PORT = 8080;

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("newProduct", async (data) => {
    try {
      await productManager.addProduct(data);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al agregar producto:", error.message);
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await productManager.deleteProduct(id);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
