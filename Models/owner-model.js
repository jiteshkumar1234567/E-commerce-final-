const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  fullname: { type: String, minlength: 4, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: Number, default: null },
  picture: { type: String, default: null },
  products: {
    type: Array,
    default: [],
  },
  gstin: {
    type: String,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Owner", ownerSchema);
