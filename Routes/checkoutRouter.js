const express = require("express");
const router = express.Router();
const User = require("../Models/user-model");
const Order = require("../Models/order-model");

// middleware 
const isLoggedIn = require("../Middleware/isLoggedIn");

//  coupons
const coupons = {
  "SAVE10": 10, // 10% discount
  "OFF20": 20,  // 20% discount
};

router.get("/", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.session.user.id).populate("cart.product");

  let total = 0;
  user.cart.forEach(item => {
    total += item.product.finalPrice * item.quantity;
  });

  res.render("checkout", {
    cart: user.cart,
    total,
    address: user.address || "",
    discount: 0,
    finalTotal: total,
    appliedCoupon: ""
  });
});

router.post("/place-order", isLoggedIn, async (req, res) => {

  const user = await User.findById(req.session.user.id)
    .populate("cart.product");

  if (!user) {
    return res.redirect("/login");
  }

  // Total calculate
  let total = 0;
  user.cart.forEach(item => {
    total += item.product.finalPrice * item.quantity;
  });

  // Coupon
  let discountAmount = 0;
  let appliedCoupon = "";

  if (req.body.coupon) {
    const code = req.body.coupon.toUpperCase();
    if (coupons[code]) {
      discountAmount = (total * coupons[code]) / 100;
      appliedCoupon = code;
    }
  }

  const finalTotal = total - discountAmount;

  // Dates
  const orderDate = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(orderDate.getDate() + 5);

  // Create order
  const order = await Order.create({
    user: user._id,   
    items: user.cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.finalPrice
    })),
    totalAmount: finalTotal,
    discount: discountAmount,
    coupon: appliedCoupon,
    address: req.body.address || user.address || "No address",
    payment: req.body.payment,
    orderDate,
    deliveryDate,
    status: "Pending"
  });

  // Push order ID
  user.orders.push(order._id);

  // Update address
  user.address = req.body.address || user.address;

  // Clear cart
  user.cart = [];

  await user.save();

  res.redirect("/checkout/order-success");
});

router.get("/order-success", (req, res) => {
  res.render("order-success");
});

module.exports = router;
