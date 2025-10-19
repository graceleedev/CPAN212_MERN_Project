const express = require("express");
const port = 3000;
const app = express();

const { usersRoute } = require("./modules/users/users-routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//import Routes from each modules

app.use(usersRoute);

app.get("/", (req, res) => {
    res.send("Welcome to Ringo🍎");
})

// error-handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send("Oops! Internal server error!");
});

// Middleware handling 404 not found error
app.use((req, res, next) => {
  res.status(404).send(`404! ${req.method} ${req.path} Not Found.`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
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
