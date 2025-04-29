const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor activo - MB Emprende 🚀");
});

app.get("/productos", async (req, res) => {
  try {
    const response = await fetch("https://zd5inb-v0.myshopify.com/api/2023-10/graphql.json", {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
          products(first: 10) {
            edges {
              node {
                id
                title
                description
                images(first: 1) {
                  edges {
                    node {
                      url
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
        }`
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar productos desde Shopify" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});