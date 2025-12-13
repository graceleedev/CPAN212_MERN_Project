const express = require("express");
const usersRoute = express.Router();

const { createUserRules } = require("./middlewares/create-user-rules.js");
const { loginUserRules } = require("./middlewares/login-user-rules.js");
const verifyLoginRules = require("./middlewares/verify-login-rules.js");
const { updateUserRules } = require("./middlewares/update-user-rules.js");
const checkValidation = require("../../shared/middlewares/check-validation.js");
const authorize = require("../../shared/middlewares/authorize");
const { encodeToken } = require("../../shared/jwt-utils");
const { matchPassword } = require("../../shared/password-utils");
const { randomNumberOfNDigits } = require("../../shared/compute-utils.js");
const sendEmail = require("../../shared/email-utils");

const UserModel = require("./users-model.js");
const OTPModel = require("./otp-model");

//User registration page
usersRoute.post(
  "/register",
  createUserRules,
  checkValidation,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const existingUser = await UserModel.findOne({ email: email });
      if (existingUser)
        return res
          .status(409)
          .json({ errormessage: `${email} already exist.` });

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
        email: email,
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
      // res.json({ user });
      const OTP = randomNumberOfNDigits(6);
      const addedOTP = await OTPModel.updateOne(
        {
          account: user._id,
        },
        {
          account: user._id,
          otp: OTP
        },
        { upsert: true }
      );
      if (!addedOTP) {
        return res.status(500).send({
          errorMessage: "We couldn’t generate an OTP. Please try again.",
        });
      }
      const subject = "Your Ringo verification code";
      const message = `Your one-time verification code is: ${OTP}
    Please enter this code on the verification page to continue.
    If you did not request this code, you can safely ignore this email.`;
      await sendEmail(email, subject, message);
      return res.status(200).json({
        message: "We’ve sent a verification code to your email address.",
      });
    } catch (error) {
      next(error);
    }
  }
);

//OTP verification page
usersRoute.post("/verify-login", verifyLoginRules, async (req, res) => {
  const { email, otp } = req.body;
  const foundUser = await UserModel.findOne({ email }).select("-password");
  if (!foundUser) {
    return res.status(404).send({
      errorMessage: `User with ${email} doesn't exist`,
    });
  }
  const savedOTP = await OTPModel.findOne({ account: foundUser._id, otp });
  if (!savedOTP || Number(otp) != Number(savedOTP.otp)) {
    return res.status(403).send({ errorMessage: "OTP is not valid!" });
  }

  const user = {
    id: foundUser._id.toString(),
    email: foundUser.email,
    roles: [foundUser.role],
  };
  // generate access token
  const token = encodeToken(user);
  res.json({ user, token });
});

//get user info
usersRoute.get("/:id", checkValidation, authorize(), async (req, res, next) => {
  try {
    const getId = req.params.id;
    const isAdmin = req.account.roles.includes("admin");
    const isOwner = getId == req.account.id;
    const foundUser = await UserModel.findById(getId).select("-password");
    //check if user is admin or the owner of the user account
    if (!isAdmin && !isOwner) {
      return res.status(403).send({ errorMessage: "Access denied" });
    }
    if (!foundUser) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json(foundUser);
  } catch (error) {
    next(error);
  }
});

//User setting page
//update an existing user
//only allow the owner of the account or admin to update an user
usersRoute.put(
  "/:id",
  updateUserRules,
  checkValidation,
  authorize(),
  async (req, res, next) => {
    try {
      const getId = req.params.id;
      const isAdmin = req.account.roles.includes("admin");
      const isOwner = getId == req.account.id;
      const foundUser = await UserModel.findByIdAndUpdate(
        getId,
        { $set: req.body },
        { new: true }
      ).select("-password");
      //check if user is admin or the owner of the user account
      if (!isAdmin && !isOwner) {
        return res.status(403).send({ errorMessage: "Access denied" });
      }
      if (!foundUser) {
        return res.status(404).json({ error: "user not found" });
      }
      res.status(200).json(foundUser);
    } catch (error) {
      next(error);
    }
  }
);

//delete a user
//only allow admin to delete user accounts
usersRoute.delete("/:id", authorize(["admin"]), async (req, res, next) => {
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
