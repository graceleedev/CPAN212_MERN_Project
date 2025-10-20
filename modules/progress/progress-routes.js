const express = require("express");
const progressRoute = express.Router();

const { validationResult } = require("express-validator");
const { saveProgressRules } = require("./middlewares/save-progress-rules");

const {
  getAllProgress,
  getProgressByUserId,
  addProgress,
  updateProgress,
} = require("./progress-model");

//get progress by userId
progressRoute.get("/:id", async (req, res) => {
  try {
    const getId = Number(req.params.id);
    const progress = await getProgressByUserId(getId);
    if (progress) {
      res.status(200).json(progress);
    } else {
      res.status(404).json({ error: "progress not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//create new progress by userId
progressRoute.post("/", saveProgressRules, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const addedProgress = await addProgress(req.body);
      res.status(201).json(addedProgress);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//update new progress by userId
progressRoute.put("/", saveProgressRules, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const getId = req.body.id;
    const progress = await getProgressByUserId(getId);
    if (progress) {
      const updatedProgress = await updateProgress(req.body);
      res.status(201).json(updatedProgress);
    } else {
      res.status(404).json({ error: "progress not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { progressRoute };
