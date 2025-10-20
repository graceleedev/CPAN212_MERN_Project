const express = require("express");
const lessonsRoute = express.Router();

const { validationResult } = require("express-validator");
const { filterLessonRules } = require("./middlewares/filter-lesson-rules");

const {
    getAllLessons,
    getLessonById,
    searchLesson,
    filterLesson
 } = require("./lessons-model");

const { getQuestionsByLessonId } = require("../questions/questions-model");


//search lessons
//GET /lessons/search?keyword=hello
lessonsRoute.get("/search", async (req, res) => {
    try {
        const getKeyword = req.query.keyword;
        const results = await searchLesson(getKeyword);
        if(results) {
            res.json(results);
        } else {
            res.status(200).json([]);
        }        
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

//filter lessons by level
//GET /lessons/filter?level=beginner
lessonsRoute.get("/filter", filterLessonRules, async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(400).json({ error: "Invalid level value" })
        } 
        const getLevel = req.query.level;
        const results = await filterLesson(getLevel);
        if(results) {
            res.json(results);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

//get questions by lesson id

lessonsRoute.get("/:id/questions", async (req, res) => {
    try {
        const getId = Number(req.params.id);
        const questions = await getQuestionsByLessonId(getId);
        if (questions) {
            res.status(200).json(questions);
        } else {
            res.status(404).json({ error: "No questions found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

//lesson main page
lessonsRoute.get("/:id", async (req, res) => {
    try {
        const getId = Number(req.params.id);
        const lesson = await getLessonById(getId);
        if(lesson) {
            res.status(200).json(lesson);
        } else {
            res.status(404).json({ error: "lesson not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = { lessonsRoute };