const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: { type: String, minlength: 4, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🔐 EMAIL VERIFICATION
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpiry: {
    type: Date
  },

  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: { type: Number, default: 1 }
    }
  ],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

  address: { type: String, default: null },
  contact: { type: Number, default: null },
  picture: { type: String, default: null },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
