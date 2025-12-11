const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ["simple", "scenario"],
    required: true
  },
  options: [
    {
      key: { type: String, required: true },
      text: { type: String, required: true },
    },
  ],
  correctAnswer: { type: String, required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true},
});

const QuestionModel = mongoose.model("Question", QuestionSchema);

module.exports = QuestionModel;
