const express = require("express");
const router = express.Router();
const User = require("../Models/user-model");
const Product = require("../Models/product-model");
const isLoggedIn = require("../Middleware/isLoggedIn");


// ---------------- ADD TO CART ----------------
router.post("/add/:productId", isLoggedIn, async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({ success: false, message: "User not logged in" });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) return res.json({ success: false, message: "User not found" });

    const productId = req.params.productId;
    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    res.json({ 
      success: true, 
      message: "Product added to cart", 
      cartCount: user.cart.length  // header count update ke liye
    });

  } catch (err) {
    console.error("Cart Add Error:", err);
    res.json({ success: false, message: "Something went wrong" });
  }
});



// ---------------- VIEW CART ----------------
router.get("/", isLoggedIn, async (req, res) => {
  const user = await User
    .findById(req.session.user.id)
    .populate("cart.product");

  res.render("cart", { cartItems: user ? user.cart : [] });
});


// ---------------- INCREASE QUANTITY ----------------
router.post("/increase/:productId", isLoggedIn, async (req, res) => {
  try {
    const user = await User
      .findById(req.session.user.id)
      .populate("cart.product");

    const item = user.cart.find(
      i => i.product._id.toString() === req.params.productId
    );

    if (item) {
      item.quantity += 1;
    }

    await user.save();

    let newTotal = 0;
    user.cart.forEach(i => {
      newTotal += i.product.finalPrice * i.quantity;
    });

    res.json({ success: true, newTotal });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});


// ---------------- DECREASE / REMOVE ----------------
router.post("/decrease/:productId", isLoggedIn, async (req, res) => {
  try {
    const user = await User
      .findById(req.session.user.id)
      .populate("cart.product");

    const index = user.cart.findIndex(
      i => i.product._id.toString() === req.params.productId
    );

    if (index !== -1) {
      if (user.cart[index].quantity > 1) {
        user.cart[index].quantity -= 1;
      } else {
        user.cart.splice(index, 1); // qty == 1 → remove product
      }
    }

    await user.save();

    let newTotal = 0;
    user.cart.forEach(i => {
      newTotal += i.product.finalPrice * i.quantity;
    });

    res.json({ success: true, newTotal });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});


// ---------------- REMOVE FROM CART (DIRECT) ----------------
router.post("/remove/:productId", isLoggedIn, async (req, res) => {
  try {
    const user = await User
      .findById(req.session.user.id)
      .populate("cart.product");

    user.cart = user.cart.filter(
      item => item.product._id.toString() !== req.params.productId
    );

    await user.save();

    let newTotal = 0;
    user.cart.forEach(item => {
      newTotal += item.product.finalPrice * item.quantity;
    });

    res.json({ success: true, newTotal });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Something went wrong" });
  }
});

module.exports = router;
