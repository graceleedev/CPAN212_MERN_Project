const { body } = require("express-validator");

const userNameRule = body("name")
  .notEmpty()
  .isString()
  .isLength({ min: 6 })
  .withMessage("Name must be at least 6 characters");

const emailRule = body("email")
  .notEmpty()
  .isEmail()
  .withMessage("Invalid email address");

const passwordRule = body("password")
  .notEmpty()
  .isString()
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters");

const createUserRules = [
    userNameRule,
    emailRule,
    passwordRule
];

module.exports = { createUserRules };