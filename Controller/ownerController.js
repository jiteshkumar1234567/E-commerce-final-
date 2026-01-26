const Order = require("../Models/order-model");  
const User = require("../Models/user-model");
const Product = require("../Models/product-model");  
const bcrypt = require("bcrypt");
const upload = require('../config/cloudinary');

module.exports.ownerDashboard = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  res.render("owner-dashboard", { 
    owner: req.session.owner,
    totalOrders,
    totalUsers,
    totalProducts
  });
}

// This function will be used in your route

// module.exports.addProduct = async (req, res) => {
//   try {
//     // 🔹 Correct way to get uploaded images URLs
//     const images = req.files.map(f => f.path || f.url); 
//     console.log("Images array:", images);

//     const { name, price, discount, category, description } = req.body;

//     // Validation
//     if (!name || !price || !category || !description || images.length === 0) {
//       return res.redirect("/owners/add-product?error=1");
//     }

//     const product = new Product({
//       name,
//       description,
//       images, // array of strings now
//       price,
//       discount: discount || 0,
//       category,
//     });

//     await product.save();
//     res.redirect("/owners/add-product?success=1");

//   } catch (err) {
//     console.error("ADD PRODUCT ERROR:", err);
//     res.redirect("/owners/add-product?error=1");
//   }
// };

module.exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category } = req.body;

    if (!name || !description || !price || !category || !req.files || req.files.length === 0) {
      return res.render("add-product", {
        owner: req.owner,
        error: "All fields are required",
        success: null
      });
    }

    const images = req.files.map(file => file.path);

    const product = new Product({
      name,
      description,
      price,
      discount: discount || 0,
      category,
      images
    });

    await product.save();

    return res.render("add-product", {
      owner: req.owner,
      success: "✅ Product added successfully",
      error: null
    });

  } catch (err) {
    console.error("Error adding product:", err);
    return res.render("add-product", {
      owner: req.owner,
      error: "❌ Something went wrong",
      success: null
    });
  }
};




module.exports.updateOrder =  async (req, res) => {
  try {
    const { status } = req.body; // "Pending", "Shipped", or "Delivered"
    const orderId = req.params.orderId;

    await Order.findByIdAndUpdate(orderId, { status });

    res.redirect("/owners/orders"); // redirect back to orders page
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}


module.exports.editProduct = async (req, res) => {
  try {
    const { name, price, discount, bgColor, panelColor, textColor, image } = req.body;

    const updateFields = {
      name,
      price,
      discount: discount || 0,
      bgColor: bgColor || "#f5f7fb",
      panelColor: panelColor || "#ffffff",
      textColor: textColor || "#1f2937"
    };

    // Optional image update
    if (image && image.trim() !== "") {
      updateFields.image = image.trim();
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, updateFields);

    if (!updatedProduct) return res.status(404).send("Product not found");

    res.redirect("/owners/products");
  } catch (err) {
    console.error("Edit Product Error:", err);
    res.status(500).send("Server Error");
  }
}

