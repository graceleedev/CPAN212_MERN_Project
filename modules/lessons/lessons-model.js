const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: {type: String, required: true},
  level: {type: String, required: true},
});

const LessonModel = mongoose.model("Lesson", LessonSchema);

module.exports = LessonModel;
