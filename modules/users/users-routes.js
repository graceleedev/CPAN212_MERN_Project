const express = require("express");
const usersRoute = express.Router();

const { createUserRules } = require("./middlewares/create-user-rules.js");
const { loginUserRules } = require("./middlewares/login-user-rules.js");
const { updateUserRules } = require("./middlewares/update-user-rules.js");
const checkValidation = require("../../shared/middlewares/check-validation.js");
const authorize = require("../../shared/middlewares/authorize")
const {encodeToken} = require("../../shared/jwt-utils") 
const {matchPassword} = require("../../shared/password-utils")


const UserModel = require("./users-model.js");

//User registration page
usersRoute.post(
  "/register",
  createUserRules,
  checkValidation,
  async (req, res, next) => {
    try {
      const newUser = await UserModel.create(req.body);
      const { password, ...safeUser } = newUser.toObject();
      res.status(201).json(safeUser);
    } catch (error) {
      next(error);
    }
  }
);

//User login page
usersRoute.post(
  "/login",
  loginUserRules,
  checkValidation,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find a user by email and password
      const foundUser = await UserModel.findOne({
        email: email
      });
      if (!foundUser) {
        res.status(404).json({ error: `User with ${email} doesn't exist` });
      }

      const passwordMatched = matchPassword(password, foundUser.password);
      if (!passwordMatched) {
        return res.status(401).send({
          errorMessage: "Invalid password",
        });
      }
      const user = { ...foundUser.toJSON(), password: undefined };
      const token = encodeToken(user);
      res.json({ user, token });
    } catch (error) {
      next(error);
    }
  }
);

//User setting page
//update an existing user
usersRoute.put(
  "/setting/update/:id",
  updateUserRules,
  checkValidation,
  async (req, res, next) => {
    try {
      const getId = req.params.id;
      const user = await UserModel.findByIdAndUpdate(
        getId,
        { $set: req.body },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

//delete a user
usersRoute.delete("/setting/delete/:id", async (req, res, next) => {
  try {
    const getId = req.params.id;
    const user = await UserModel.findByIdAndDelete(getId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRoute;
