const { body } = require("express-validator");

const emailRule = body("email")
  .notEmpty()
  .isEmail()
  .withMessage("Invalid email address");

const passwordRule = body("password")
  .notEmpty()
  .withMessage("Password is required");

const loginUserRules = [
    emailRule,
    passwordRule
];

module.exports = { loginUserRules };