const express = require("express");
const port = 3000;
const app = express();

const { usersRoute } = require("./modules/users/users-routes");
const { lessonsRoute } = require("./modules/users/lessons-routes");
const { questionsRoute } = require("./modules/users/questions-routes");
const { progressRoute } = require("./modules/users/progress-routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//import Routes from each modules

app.use("/users", usersRoute);
app.use("/lessons", lessonsRoute);
app.use("/questions", questionsRoute);
app.use("/products", progressRoute);

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
