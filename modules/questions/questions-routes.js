const express = require("express");
const questionsRoute = express.Router();

const { getQuestionById, checkAnswer } = require("./questions-model");

//get questions by questionId
questionsRoute.get("/:id", async (req, res) => {
  try {
    const getId = req.params.id;
    const question = await getQuestionById(getId);
    if (question) {
        res.status(200).json(question);
    } else {
        res.status(404).send("questions not found");
    }
  } catch (error) {
    res.status(500).send("internal server error");
  }
});

//check answers
//id, answer
questionsRoute.post("/:id/answer", async (req, res) => {
  try {
    const getId = req.params.id;
    const getAnswer = req.body.answer;
    const question = await getQuestionById(getId);

    if (question) {
        const result = await checkAnswer(getId, getAnswer);
    res.status(200).json(result)
    } else {
        return res.status(404).send("questions not found");
    }
  } catch (error) {
    res.status(500).send("internal server error");
  }
});

module.exports = { questionsRoute };