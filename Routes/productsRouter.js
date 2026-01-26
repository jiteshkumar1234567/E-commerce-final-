const express = require("express");
const router = express.Router();
const Product = require("../Models/product-model");

// GET products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.render("products", { products });
});

// product detail page
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("product-detail", { product });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
