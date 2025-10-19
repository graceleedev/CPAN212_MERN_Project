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

//lesson main page

lessonsRoute.get("/:id", async (req, res) => {
    try {
        const getId = get.params.id;
        const lesson = await getLessonById(getId);
        if(!lesson) {
            res.status(404).send("lesson not found");
        } else {
            res.status(200).json(lesson);
        }
    } catch (error) {
        res.status(500).send("Internal server error")
    }
})

//search lessons
//GET /lessons/search?keyword=hello

lessonsRoute.get("/search", async (req, res) => {
    try {
        const getKeyword = req.query.keyword;
        const results = await searchLesson(getKeyword);
        if(!results) {
            res.status(200).json([]);
        } else {
            res.json(results);
        }        
    } catch (error) {
        res.status(500).send("Internal server error")
    }
});

//filter lessons by level
//GET /lessons/filter?level=beginner

lessonsRoute.get("/filter", filterLessonRules, async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty) {
            res.status(404).send("Invalid level value")
        } 
        const getLevel = req.query.level;
        const results = await filterLesson(getLevel);
        if(!results) {
            res.status(200).json([]);
        } else {
            res.json(results);
        }
        
    } catch (error) {
        res.status(500).send("Internal server error")
    }
});