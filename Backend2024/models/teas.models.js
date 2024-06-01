const mongoose = require("mongoose");

const teaSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Tea", teaSchema);
