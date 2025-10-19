const express = require("express");
const usersRoute = express.Router();

const { createUserRules } = require("./middlewares/create-user-rules.js");
const { loginUserRules } = require("./middlewares/login-user-rules.js");
const { updateUserRules } = require("./middlewares/update-user-rules.js");
const { validationResult } = require("express-validator");

const {
    getAllUsers,
    getUserByEmail,
    getUserById,
    addUser,
    updateUser,
    deleteUser
} = require("./users-model");

//User registration page
usersRoute.post("/register", createUserRules, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        } else {            
            const newUser = await addUser(req.body);
            res.json(newUser);
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

//User login page
usersRoute.post("/login", loginUserRules, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        } else {            
            const { email } = req.body;
            const loginUser = await getUserByEmail(email);
            res.json(loginUser);
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

//User setting page
usersRoute.put("/setting/update/:id", updateUserRules, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        } else {            
            const updatedUser = await updateUser(req.params.id);
            res.json(updatedUser);
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

usersRoute.delete("/setting/delete/:id", async(req, res) => {
    try {
        const getId = parseInt(req.params.id);
        const user = await getUserById(getId);
        if (user) {
            const deletedUser = await deleteUser(getId);            
            res.json(deletedUser);
        } else {
            res.status(404).send("user not found");
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

module.exports = { usersRoute };