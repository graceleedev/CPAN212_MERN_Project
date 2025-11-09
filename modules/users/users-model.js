const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 6 },
  email: { type: String, required: true },
  password: { type: String, required: true, minLength: 6 },
  isAdmin: { type: Boolean },
  progress: { type: mongoose.Schema.Types.ObjectId, ref: "Progress" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
