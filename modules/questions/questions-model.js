const { readFile } = require("../../shared/file-utils");
const filePath = "./data/questions.json";

//read file
async function getAllQuestions() {
  return readFile(filePath);
}

//find lesson by id
async function getQuestionById(quesionId) {
  if (!quesionId) throw new Error(`Cannot use ${quesionId} to get questions`);
  const allQuestions = await getAllQuestions();
  const foundQuestion = allQuestions.find(
    (question) => question.id === quesionId
  );
  return foundQuestion;
}

//Check answer
async function checkAnswer(questionId, answer) {
  const question = await getQuestionById(questionId);
  if (!question) throw new Error("Question not found");

  const isCorrect = question.correctAnswer === answer;
  const feedback = isCorrect ? "Correct!" : "Try again";

  return { isCorrect, feedback };
}

//get questions by lessonId
async function getQuestionsByLessonId(lessonId) {
  if (!lessonId) throw new Error(`Cannot use ${lessonId} to get questions`);
  const allQuestions = await getAllQuestions();
  const foundQuestion = allQuestions.find(
    (question) => question.lessonId === lessonId
  );
  return foundQuestion;
}

module.exports = {
    getAllQuestions,
    getQuestionById,
    checkAnswer,
    getQuestionsByLessonId
};
