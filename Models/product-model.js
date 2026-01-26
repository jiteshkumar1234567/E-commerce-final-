const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    images: { type: [String], default: [] }, // multiple images
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    category: { type: String, required: true }, // free text, custom allowed
    description: { type: String, required: true },
    bgColor: { type: String, default: "#f5f7fb" },
    panelColor: { type: String, default: "#ffffff" },
    textColor: { type: String, default: "#1f2937" },
    finalPrice: { type: Number },
  },
  { timestamps: true }
);

// calculate finalPrice before save
productSchema.pre("save", function () {
  const price = Number(this.price);
  const discount = Number(this.discount || 0);

  this.finalPrice =
    discount > 0
      ? Number((price - (price * discount) / 100).toFixed(2))
      : Number(price.toFixed(2));
});

module.exports = mongoose.model("Product", productSchema);
