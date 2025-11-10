const express = require("express");
const questionsRoute = express.Router();

const QuestionModel = require("./questions-model");

//get questions by questionId
questionsRoute.get("/:id", async (req, res, next) => {
  try {
    const getId = req.params.id;
    const question = await QuestionModel.findById(getId);
    if (!question) return res.status(404).json({ error: "question not found" });
    res.status(200).json(question);
  } catch (error) {
    next(error);
  }
});

//check answers
//id, answer
questionsRoute.post("/:id/answer", async (req, res, next) => {
  try {
    const getId = req.params.id;
    const getAnswer = req.body.answer;
    const question = await QuestionModel.findById(getId);
    if (!question) return res.status(404).json({ error: "question not found" });
    const isCorrect = question.correctAnswer === getAnswer;
    const feedback = isCorrect ? "Correct!" : "Try again";
    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
});

module.exports = questionsRoute;
