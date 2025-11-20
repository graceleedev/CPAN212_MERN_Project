const express = require("express");
const usersRoute = express.Router();

const { createUserRules } = require("./middlewares/create-user-rules.js");
const { loginUserRules } = require("./middlewares/login-user-rules.js");
const { updateUserRules } = require("./middlewares/update-user-rules.js");
const checkValidation = require("../../shared/middlewares/check-validation.js");

const UserModel = require("./users-model.js");

//User registration page
usersRoute.post(
  "/register",
  createUserRules,
  checkValidation,
  async (req, res, next) => {
    try {
      const newUser = await UserModel.create(req.body);
      res.status(201).json(newUser);
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
      const getEmail = req.body.email;
      const getPassword = req.body.password;

      // Find a user by email and password and hide password in a response
      const user = await UserModel.findOne({
        email: getEmail,
        password: getPassword,
      }).select("-password");

      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ error: "Invalid email or password. Please try again." });
      }
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
