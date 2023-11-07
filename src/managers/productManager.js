import fs from "fs";

export class ProductManager {
  constructor() {
    this.path = "./src/data/products.json";
    this.pathcarts = "./src/data/carts.json";
    this.idProduct = 1;

    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, "[]");
    }
    if (!fs.existsSync(this.pathcarts)) {
      fs.writeFileSync(this.pathcarts, "[]");
    }
  };

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(products);
      } else {
        return [];
      }
    } catch (error) {
      console.log("Error al leer el archivo: " + error);
    }
  };

  async addProduct(title, description, price, thumbnails, code, stock) {
    if (!title || !description || !price || !thumbnails || !code || !stock) {
      throw new Error("Falta informacion");
    }
    const products = await this.getProducts();
    const newProduct = {
      id: products[products.length - 1].id + 1,
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status: true,
    };
    const datos = await this.getProducts();
    if (datos.some((product) => product.code == code)) {
      throw new Error("El codigo ya esta siendo utilizado.");
    } else {
      datos.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(datos));
      return console.log("Producto añadido con exito.");
    }
  };

  async getProductByID(id) {
    const products = await this.getProducts();
    const productFind = products.find((product) => product.id == id);
    if (!productFind) {
      throw new Error("ID no encontrado")
    } else {
      return productFind;
    }
  };

  async deleteProduct(id) {
    const products = await this.getProducts();
    let p = 0;
    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      if (element.id == id) {
        products.splice(index, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return console.log("Eliminado.");
      } else {
        p++;
      }
    } if (p > 0) {
      console.log("ID no encontrado");
      throw new Error("ID no encontrado");
    }
    if (productos.length == 0) {
      console.log("Lista productos vacia.");
      throw new Error("Lista productos vacia.");
    }
  };

  async updateProduct(id, newInfo) {
    console.log(newInfo);
    const products = await this.getProducts();
    const productToUpdate = products.findIndex((e) => e.id == id);
    console.log(productToUpdate);
    if (productToUpdate >= 0) {
      if (products.some((e) => e.code == newInfo.code)) {
        throw new Error("Codigo ya en uso.");
      }
      products[productToUpdate] = {
        id: products[productToUpdate].id,
        title: newInfo.title || products[productToUpdate].title,
        description:
          newInfo.description || products[productToUpdate].description,
        price: newInfo.price || products[productToUpdate].price,
        thumbnail: newInfo.thumbnails || products[productToUpdate].thumbnails,
        code: newInfo.code || products[productToUpdate].code,
        stock: newInfo.stock || products[productToUpdate].stock,
      };
      
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      console.log("Informacion actualizada.")
    } else {
      throw new Error("ID no encontrado.");
    }
  };

  async createCart() {
    const carts = await this.getCarts();
    carts.push({ id: carts.length + 1, products: [] });
    await fs.promises.writeFile(this.pathcarts, JSON.stringify(carts));
  };

  async updateCart(cart) {
    await fs.promises.writeFile(this.pathcarts, JSON.stringify(cart));
  };

  async getCarts() {
    const carts = await fs.promises.readFile(this.pathcarts, "utf-8");
    return JSON.parse(carts);
  };

  async getCartByID(id) {
    const carts = await this.getCarts();
    const cartFind = carts.find((cart) => cart.id == id);
    if (!cartFind) {
      throw new Error("ID no encontrado");
    } else {
      return cartFind;
    }
  }};