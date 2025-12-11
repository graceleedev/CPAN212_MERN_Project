require("dotenv").config();

const express = require("express");
const port = process.env.PORT || 3000;
const hostname = "0.0.0.0";
const app = express();
const cors = require("cors");

const usersRoute = require("./modules/users/users-routes");
const lessonsRoute = require("./modules/lessons/lessons-routes");
const questionsRoute = require("./modules/questions/questions-routes");
const progressRoute = require("./modules/progress/progress-routes");
const connectDB = require("./shared/middlewares/connect-db");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cpan-212-mern-project.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Add the connectDB middleware in application-level
app.use(connectDB);

//import Routes from each modules
app.use("/users", usersRoute);
app.use("/lessons", lessonsRoute);
app.use("/questions", questionsRoute);
app.use("/progress", progressRoute);

//main page
app.get("/", (req, res) => {
  res.send("Welcome to Ringo🍎");
});

// error-handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ error: "Internal server error!" });
});

// Middleware handling 404 not found error
app.use((req, res, next) => {
  res.status(404).json({ error: `404! ${req.method} ${req.path} Not Found.` });
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
