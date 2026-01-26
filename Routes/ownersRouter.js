const express = require("express");
const router = express.Router();
const ownerModel = require("../Models/owner-model");
const Order = require("../Models/order-model");      
const User = require("../Models/user-model");
const Product = require("../Models/product-model");
const bcrypt = require("bcrypt");
const isOwner = require("../Middleware/isOwner");
const upload = require('../config/cloudinary'); 
const { ownerDashboard, addProduct, updateOrder, editProduct } = require("../Controller/ownerController");

/*  CREATE OWNER (DEV ONLY) */
if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    try {
      const owners = await ownerModel.find();
      if (owners.length > 0) {
        return res
          .status(503)
          .send("You don't have permission to create another owner");
      }

      const { fullname, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const createdOwner = await ownerModel.create({
        fullname,
        email,
        password: hashedPassword,
      });

      res.status(201).send(createdOwner);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });
}


/* DASHBOARD */
router.get("/dashboard", isOwner, ownerDashboard);

/* ADD PRODUCT PAGE */
router.get("/add-product", isOwner, (req, res) => {
  res.render("add-product", {
    owner: req.session.owner || {},
    error: req.query.error || false,
    success: req.query.success || false
  });
});

router.post(
  "/add-product",
  isOwner,
  upload.array("images", 5),
  addProduct
);


// ---------------- VIEW ALL ORDERS ----------------
router.get("/orders", isOwner, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullname email")
      .populate("items.product", "name images finalPrice");

    res.render("owner-orders", {
      owner: req.session.owner,
      orders
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


// Update order status
router.post("/orders/update-status/:orderId", isOwner, updateOrder);


// VIEW ALL PRODUCTS
router.get("/products", isOwner, async (req, res) => {
  try {
    const products = await Product.find();
    res.render("owner-products", { owner: req.session.owner, products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// DELETE PRODUCT
router.post("/products/delete/:productId", isOwner, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.productId);
    res.redirect("/owners/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET edit product page
router.get("/products/edit/:productId", isOwner, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).send("Product not found");

    res.render("edit-product", { owner: req.session.owner, product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//  edit product → save changes
router.post("/products/edit/:productId", isOwner, editProduct);

// GET USERS
router.get("/users", isOwner, async (req, res) => {
  try {
    const users = await User.find()
      .select("fullname email createdAt isVerified"); // 👈 IMPORTANT

    const owner = req.session.owner
      ? { fullname: req.session.owner.fullname }
      : null;

    const user = req.session.user
      ? { fullname: req.session.user.fullname }
      : null;

    res.render("owner-users", {
      users,
      owner,
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});


// USER DELETE
router.post("/users/delete/:id", isOwner, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/owners/users");
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = router;
