// rest-api/models/Product.js
const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, default: "", maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Product", ProductSchema);
