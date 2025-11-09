const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  updatedAt: { type: Date, default: Date.now },
});

const ProgressModel = mongoose.model("Progress", ProgressSchema);

module.exports = ProgressModel;
