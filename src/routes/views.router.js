import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";
const router = Router();
const store = new ProductManager();

router.get(("/"), async (req, res)=>{
    const products = await store.getProducts();
    res.render("home", {products});
})

router.get("/realtimeproducts", async (req, res) => {
  const products = await store.getProducts();
  res.render("realTimeProduct", { products });
});


export default router;