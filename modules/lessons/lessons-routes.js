const express = require("express");
const lessonsRoute = express.Router();

const { filterLessonRules } = require("./middlewares/filter-lesson-rules");
const checkValidation = require("../../shared/middlewares/check-validation.js");

const LessonModel = require("./lessons-model");
const QuestionModel = require("../questions/questions-model.js");

//search lessons
//example: /lessons/search?keyword=hello
lessonsRoute.get("/search", async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const results = await LessonModel.find({
      title: { $regex: keyword, $options: "i" },
    })
      .sort({ title: 1 })
      .skip(skip)
      .limit(Number(limit));

    // Check if there are more results for pagination ("Show more" button)
    const totalCount = await LessonModel.countDocuments({
      title: { $regex: keyword, $options: "i" },
    });
    const hasMore = page * limit < totalCount;

    if (results.length === 0) return res.status(200).json([]);
    res.json({ results, hasMore });
  } catch (error) {
    next(error);
  }
});

//filter lessons by level
//example: /lessons/filter?level=beginner
lessonsRoute.get(
  "/filter",
  filterLessonRules,
  checkValidation,
  async (req, res, next) => {
    try {
      const getLevel = req.query.level;
      const results = await LessonModel.find({
        level: getLevel.toLowerCase(),
      });
      if (results.length === 0) return res.status(200).json([]);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
);

//lesson main page
//get all lessons
lessonsRoute.get("/", async (req, res, next) => {
  try {
    const lessons = await LessonModel.find();
    if (lessons.length === 0) return res.status(200).json([]);
    res.status(200).json(lessons);
  } catch (error) {
    next(error);
  }
});

//get lessons by lessonId
lessonsRoute.get("/:id", async (req, res, next) => {
  try {
    const getId = req.params.id;
    const lesson = await LessonModel.findById(getId);

    if (!lesson) return res.status(404).json({ error: "lesson not found" });
    res.status(200).json(lesson);
  } catch (error) {
    next(error);
  }
});

//get questions by lessonId
lessonsRoute.get("/:id/questions", async (req, res, next) => {
  try {
    const getId = req.params.id;
    const questions = await QuestionModel.find({ lessonId: getId });

    if (!questions)
      return res.status(404).json({ error: "No questions found" });
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
});

module.exports = lessonsRoute;
