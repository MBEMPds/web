document.addEventListener("DOMContentLoaded", async () => {
  const productosContainer = document.getElementById("productos");
  try {
    const response = await fetch("https://mb-emprende-backend.onrender.com/productos");
    const data = await response.json();
    const productos = data.data.products.edges;

    productos.forEach(({ node }) => {
      const imagen = node.images.edges[0]?.node.url || "";
      const titulo = node.title;
      const descripcion = node.description;
      const precio = node.variants.edges[0]?.node.price.amount || "0.00";
      const variantId = node.variants.edges[0]?.node.id.split("/").pop();

      const productoHTML = `
        <div class="producto">
          <img src="${imagen}" alt="${titulo}">
          <h3>${titulo}</h3>
          <p>${descripcion}</p>
          <p><strong>$${precio}</strong></p>
          <a class="boton-comprar" href="https://zd5inb-v0.myshopify.com/cart/${variantId}:1" target="_blank">Comprar Ahora</a>
        </div>
      `;

      productosContainer.innerHTML += productoHTML;
    });
  } catch (error) {
    productosContainer.innerHTML = "<p>Error al cargar productos.</p>";
    console.error(error);
  }
});