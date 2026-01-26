const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

  images: {               
    type: [String],        // array of URLs
    required: true,
  },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number, // percentage (e.g. 20 means 20%)
      default: 0,
    },

    // 🔥 CATEGORY (IMPORTANT)
    category: {
      type: String,
      required: true,
      enum: [
        "mobiles",
        "laptops",
        "headphones",
        "accessories",
        "smartwatches",
        "gaming"
      ],
    },

      description: {
    type: String,
    required: true
  },

    // UI related colors
    bgColor: {
      type: String,
      default: "#f5f7fb",
    },
    panelColor: {
      type: String,
      default: "#ffffff",
    },
    textColor: {
      type: String,
      default: "#1f2937",
    },

    // auto calculated final price
    finalPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

// calculate finalPrice before save
productSchema.pre("save", function () {
  const price = Number(this.price);
  const discount = Number(this.discount || 0);

  if (discount > 0) {
    this.finalPrice = parseFloat(
      (price - (price * discount) / 100).toFixed(2)
    );
  } else {
    this.finalPrice = parseFloat(price.toFixed(2));
  }
});

module.exports = mongoose.model("Product", productSchema);
