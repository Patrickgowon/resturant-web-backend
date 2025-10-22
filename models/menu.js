const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Menu item name is required"] },
  price: { type: Number, required: [true, "Price is required"] },
  description: { type: String, required: [true, "Description is required"] },
  image: { type: String, required: [true, "Image URL is required"] },
}, { timestamps: true });

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
