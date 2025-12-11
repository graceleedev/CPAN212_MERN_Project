const express = require("express");
const progressRoute = express.Router();

const { saveProgressRules } = require("./middlewares/save-progress-rules");
const checkValidation = require("../../shared/middlewares/check-validation.js");

const ProgressModel = require("./progress-model.js");

//get progress by userId
progressRoute.get("/:userId", async (req, res, next) => {
  try {
    const getId = req.params.userId;
    const progress = await ProgressModel.findOne({ userId: getId });
    if (!progress) return res.status(404).json({ error: "progress not found" });
    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
});

//create new progress by userId
progressRoute.post(
  "/",
  saveProgressRules,
  checkValidation,
  async (req, res, next) => {
    try {
      const { userId } = req.body;
      //check if the user exist
      const existingProgress = await ProgressModel.findOne({ userId });

      // Return 409 Conflict if a progress record for this user already exists
      if (existingProgress)
        return res
          .status(409)
          .json({ error: "Progress for this user already exists" });

      const progress = await ProgressModel.create(req.body);
      res.status(201).json(progress);
    } catch (error) {
      next(error);
    }
  }
);

//update new progress by userId
progressRoute.put(
  "/",
  saveProgressRules,
  checkValidation,
  async (req, res, next) => {
    try {
      const { userId } = req.body;
      const progress = await ProgressModel.findOneAndUpdate(
        { userId },
        { $set: req.body },
        { new: true }
      );

      if (!progress)
        return res.status(404).json({ error: "progress not found" });
      res.status(200).json(progress);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = progressRoute;
