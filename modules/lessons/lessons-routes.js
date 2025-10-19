
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
