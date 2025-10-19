const express = require("express");
const progressRoute = express.Router();

//create new user progress
app.post("/users/:userId/lessons/:language/progress", (req, res) => {
    res.send("Create new user progress");
});