const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  },
  { timestamps: true }
);

const ProgressModel = mongoose.model("Progress", ProgressSchema);

module.exports = ProgressModel;
