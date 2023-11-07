import express from "express";
import productsRouter from "./routes/products.router.js";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import { ProductManager } from "./managers/productManager.js";

const store = new ProductManager();
const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, () => {
  console.log("Server corriendo en puerto ", PORT);
});

const socketServer = new Server(httpServer);
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

socketServer.on("connection", async (socket) => {
  console.log("Nuevo Cliente conectado");
  const products = await store.getProducts();
  console.log(products)
  socket.emit("products", products);
  
  socket.on("productAdded", (newProduct) => {
    products.push(newProduct);
    console.log(newProduct)
    socketServer.emit("productAdded", newProduct);
});

});



export default socketServer;