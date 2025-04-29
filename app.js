
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("productos");
  const shopifyDomain = "zd5inb-v0.myshopify.com";
  const token = "aa0a5c82071a815446914c9d76077c8d";

  const response = await fetch(`https://${shopifyDomain}/api/2023-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query: `
        {
          products(first: 10) {
            edges {
              node {
                title
                description
                images(first: 1) {
                  edges {
                    node {
                      src
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      price {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    })
  });

  const result = await response.json();
  const productos = result.data.products.edges;

  productos.forEach(({ node }) => {
    const imagen = node.images.edges[0]?.node.src || "";
    const precio = node.variants.edges[0]?.node.price.amount || "0";
    const variantId = node.variants.edges[0]?.node.id.split("/").pop();

    const html = `
      <div class="producto">
        <img src="${imagen}" alt="${node.title}" width="200" />
        <h3>${node.title}</h3>
        <p>${node.description}</p>
        <p><strong>$${precio}</strong></p>
        <a href="https://${shopifyDomain}/cart/${variantId}:1" class="boton-comprar" target="_blank">Comprar Ahora</a>
      </div>
    `;
    container.innerHTML += html;
  });
});
