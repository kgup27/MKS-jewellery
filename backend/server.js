const express = require("express");

const app = express();

app.use(express.json());

// ===================== DUMMY PRODUCTS =====================

const products = [
  {
    product_id: "1",
    category_id: 1,
    name: "Gold Ring",
    description: "22K Gold Ring",
    base_price: 25000,
    metal_type: "Gold",
    gemstone: "None",
    weight_grams: 5.2,
    stock_quantity: 10,
    image_url: "https://via.placeholder.com/200",
    brand: "MKS Jewellery",
    rating: 4.8,
    is_active: true,
  },
  {
    product_id: "2",
    category_id: 2,
    name: "Diamond Necklace",
    description: "Beautiful Diamond Necklace",
    base_price: 75000,
    metal_type: "Gold",
    gemstone: "Diamond",
    weight_grams: 18.5,
    stock_quantity: 5,
    image_url: "https://via.placeholder.com/200",
    brand: "MKS Jewellery",
    rating: 4.9,
    is_active: true,
  },
  {
    product_id: "3",
    category_id: 3,
    name: "Silver Bracelet",
    description: "Pure Silver Bracelet",
    base_price: 4500,
    metal_type: "Silver",
    gemstone: "None",
    weight_grams: 12.4,
    stock_quantity: 20,
    image_url: "https://via.placeholder.com/200",
    brand: "MKS Jewellery",
    rating: 4.6,
    is_active: true,
  },
];

// ===================== GET ALL PRODUCTS =====================

app.get("/api/products", (req, res) => {
  res.json(products);
});

// ===================== GET PRODUCT BY ID =====================

app.get("/api/products/:id", (req, res) => {
  const product = products.find(
    (p) => p.product_id === req.params.id
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
});

// ===================== TEST =====================

app.get("/test", (req, res) => {
  res.send("SERVER UPDATED");
});

app.listen(3000, () => {
  console.log("Jewelry Server running perfectly on port 3000");
});