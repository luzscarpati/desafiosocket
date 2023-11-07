const socket = io();
socket.on("products", (data) => {
  const listProduct = document.getElementById("listProducts");
  listProduct.innerHTML = " ";
  data.forEach((element) => {
    const items = `
      <div>
        <h3>${element.title}</h3>
        <p>Description: ${element.description}</p>
        <p>ID: ${element.id}</p>
        <p>$ ${element.price}</p>
        <p>Stock: ${element.stock}</p>
      </div>`;
    listProduct.innerHTML += items;
  });
});

socket.on("productAdded", (newProduct) => {
  const listProduct = document.getElementById("listProducts");
  const newItem = `
    <div>
      <h3>${newProduct.title}</h3>
      <p>Description: ${newProduct.description}</p>
      <p>ID: ${newProduct.id}</p>
      <p>$ ${newProduct.price}</p>
      <p>Stock: ${newProduct.stock}</p>
    </div>`;

  listProduct.innerHTML = newItem + listProduct.innerHTML;
});

const SEND = (event) => {
  event.preventDefault();
  const form = document.getElementById('form');
  const dataForm = new FormData(form);
  const title = dataForm.get('title');
  const description = dataForm.get('description');
  const price = dataForm.get('price');
  const code = dataForm.get('code');
  const stock = dataForm.get('stock');
  const product = { title, description, price, code, stock };

  fetch('/api/products', {
    method: "POST",
    body: JSON.stringify(product),
    headers: { "Content-type": "application/json" }
  })
    .then(response => response.json())
    .then(newProduct => {

      socket.emit("addProduct", newProduct);
    })
    .catch(error => {
      console.log("Error!: " + error);
    });
};
