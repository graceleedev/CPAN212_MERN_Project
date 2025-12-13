const express = require("express");
const lessonsRoute = express.Router();

const { filterLessonRules } = require("./middlewares/filter-lesson-rules");
const checkValidation = require("../../shared/middlewares/check-validation.js");

const LessonModel = require("./lessons-model");
const QuestionModel = require("../questions/questions-model.js");

//lesson main page
//get all lessons
//search and filter lessons if user entered input

//url example: /lessons/?keyword=hello
// /lessons?level=beginner
// /lessons?keyword=hello&level=beginner&page=1&limit=10
lessonsRoute.get("/", async (req, res, next) => {
  try {
    const { keyword, level, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};

    if (keyword && keyword.trim()) {
      filter.title = { $regex: keyword, $options: "i" };
    }
    if (level && level.trim()) {
      filter.level = level.trim().toLowerCase();
    }

    const [results, totalCount] = await Promise.all([
      LessonModel.find(filter)
        .sort({ title: 1 })
        .skip(skip)
        .limit(Number(limit)),
      LessonModel.countDocuments(filter),
    ]);

    // Check if there are more results for pagination ("Show more" button)
    const hasMore = page * limit < totalCount;

    return res.status(200).json({ results, totalCount, hasMore });
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
