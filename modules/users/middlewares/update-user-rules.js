const { body } = require("express-validator");

const userNameRule = body("name")
  .optional()
  .isString()
  .isLength({ min: 6 })
  .withMessage("Name must be at least 6 characters");

const emailRule = body("email")
  .optional()
  .isEmail()
  .withMessage("Invalid email address");

const passwordRule = body("password")
  .optional()
  .isString()
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters");

const updateUserRules = [
    userNameRule,
    emailRule,
    passwordRule
];

module.exports = { updateUserRules };