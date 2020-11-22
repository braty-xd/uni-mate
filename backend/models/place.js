const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: [String], required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  city: { type: String, required: true },
  university: { type: String, required: true },
});

module.exports = mongoose.model("Place", placeSchema);
