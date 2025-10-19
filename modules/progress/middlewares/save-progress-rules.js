const { body } = require("express-validator");

const saveProgressRules = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required"),
  body("lessonId")
    .notEmpty()
    .withMessage("Lesson ID is required"),
  body("updatedAt")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format (use ISO 8601)")
];

module.exports = { saveProgressRules };
