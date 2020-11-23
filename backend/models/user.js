const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwd: { type: String, required: true },
  hasPlace: { type: Boolean, required: true, default: false },
  city: { type: String },
  university: { type: String },
  sex: { type: String },
  nameSurname: { type: String },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
