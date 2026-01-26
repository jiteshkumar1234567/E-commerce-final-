const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

items: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    quantity: Number
  }
],
  totalAmount: Number,

  orderDate: {
    type: Date,
    default: Date.now
  },

  deliveryDate: Date,

  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered"],
    default: "Pending"
  }
});

module.exports = mongoose.model("Order", orderSchema);
