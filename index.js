// index.js
const app = require("./src/app");
const http = require("http");
const { Server } = require("socket.io");
const Product = require("./src/models/product.model");

const server = http.createServer(app);
const io = new Server(server);

const PORT = 8080;

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("newProduct", async (data) => {
    try {
      await Product.create(data);
      const products = await Product.find().lean();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al agregar producto:", error.message);
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await Product.findByIdAndDelete(id);
      const products = await Product.find().lean();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
