const mongoose = require("mongoose");
const {
  encodePassword,
  matchPassword,
} = require("../../shared/password-utils");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 6 },
    email: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    progress: { type: mongoose.Schema.Types.ObjectId, ref: "Progress" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

UserSchema.pre("save", async function (next) {
  try {
    const isChange = this.isModified("password");
    if (isChange) {
      this.password = await encodePassword(this.password);
      next();
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
