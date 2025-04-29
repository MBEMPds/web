async function cargarProductos() {
  const spinner = document.getElementById('spinner');
  const productosDiv = document.getElementById('productos');
  spinner.style.display = 'block';
  productosDiv.innerHTML = '';

  const query = `{
    products(first: 10) {
      edges {
        node {
          id
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
                price
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();
    const productos = result.data.products.edges;

    productos.forEach(async ({ node }) => {
      const div = document.createElement('div');
      div.className = 'producto';
      
      const nombreInteligente = await obtenerNombreIA(node.title);
      
      div.innerHTML = `
        <img src="${node.images.edges[0]?.node.src || 'img/default.png'}" alt="${nombreInteligente}">
        <h3>${nombreInteligente}</h3>
        <p>$${node.variants.edges[0]?.node.price || 'N/A'}</p>
        <a class="boton-comprar" href="https://paypal.me/mbemp6/50" target="_blank">Comprar</a>
      `;
      productosDiv.appendChild(div);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    spinner.style.display = 'none';
  }
}

async function obtenerNombreIA(nombreProducto) {
  const prompt = `Simplifica y mejora este nombre de producto para marketing: "${nombreProducto}"`;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error IA:', error);
    return nombreProducto;
  }
}