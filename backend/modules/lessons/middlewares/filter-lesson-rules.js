const { body } = require("express-validator");

const filterLessonRules = [
    body("level")
        .optional()
        .isIn(["beginner", "intermidiate", "advanced"])
        .withMessage("Invalid level value")
]

module.exports = { filterLessonRules }