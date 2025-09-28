const express = require("express");
const port = 3000;

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to Ringo🍎");
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

//User registration & login pages

//Post user registration 
app.post("/users/register", (req, res) => {
    res.send("User registered successfully");
});

//Post user login
app.post("/users/login", (req, res) => {
    res.send("User logged in successfully");
});

//Post admin registration
app.post("/admins/login", (req, res) => {
    res.send("Admin logged in successfully");
});

//Lesson main page

//show lessons and user progress by language
app.get("/users/:userId/lessons/:language/progress", (req, res) => {
    // add if condition and req.param
    // if(req.params.language == "japanese"){
    //     res.send("Learn Japanese");
    // } else if(req.params.language == "english"){
    //     res.send("Learn English");
    // }
});

//create new user progress
app.post("/users/:userId/lessons/:language/progress", (req, res) => {
    res.send("Create new user progress");
});

//Lessons

//get simple question lesson by leesonId
app.get("/lessons/:lessonId/questions", (req, res) => {
    res.send("simple questions by lessonId");
});

//post simple question answer
app.post("/lessons/:lessonId/questions/:questionId/answer", (req, res) => {
    res.send("simple question answer submitted");
});

//get scenario-based game lesson by leesonId
app.get("/lessons/:lessonId/scenario", (req, res) => {
    res.send("scenario by lessonId");
});

//post scenario-based game answer
app.post("/lessons/:lessonId/scenario/:scenarioId/answer", (req, res) => {
    res.send("scenario-based game answer submitted");
});

//update user progress after lessons finished
app.put("/users/:userId/lessons/:language/progress", (req, res) => {
    res.send("user progress updated");
});

//Collection

//get all words user has learned
app.get("/collection", (req, res) => {
    res.send("All words");
});

//search words user has learned
app.get("/collection/search", (req, res) => {
    //add req.query
    res.send("search words");
});

//Filter words by learned/unlearned status
app.get("/collection/filter", (req, res) => {
    //add req.query
    res.send("filter words");
});

//Admin page

//get all users
app.get("/admin/users", (req, res) => {
    res.send("all users");
});

//create users
app.post("/admin/users", (req, res) => {
    res.send("create users");
});

//remove users
app.delete("/admin/users/:userId", (req, res) => {
    res.send("remove users");
});
