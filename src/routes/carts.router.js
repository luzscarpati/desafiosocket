import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";
const store = new ProductManager();
const router = Router();

router.post("/", async (req, res) => {
  try {
    store.createCart();
    res.status(200).send("Carro creado con exito.");
  } catch (error) {
    console.log("Error:", error);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const producto = await store.getProductByID(pid);
  const cart = await store.getCarts();
  if (producto && cart[cid - 1]) {
    if (cart[cid - 1].products.some((e) => e.product.id == pid)) {
      const toAddQuantity = cart[cid - 1].products.find(
        (e) => e.product.id == pid
      );
      toAddQuantity.product.quantity++;
      res.status(200).json({ message: "Se agrego un item al carrito" });
    } else {
      cart[cid - 1].products.push({
        product: { id: parseInt(pid), quantity: 1 },
      });
      res.status(200).json({ message: "Agregado al carrito" });
    }
    await store.updateCart(cart);
  } else {
    res.status(404).send({ message: "Carrito o producto no existe." });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;
    const cart = await store.getCartByID(id);
    res.status(200).send(cart);
  } catch (error) {
    res.status(404).send({
      error: "No se pudo encontrar el carro.",
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    res.status(200).send(await store.getCarts());
  } catch (error) {
    res.status(404).send({
      error: "No se pudo encontrar el carro.",
      message: error.message,
    });
  }
});

export default router;