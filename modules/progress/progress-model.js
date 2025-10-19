const { readFile, writeToFile } = require("../../shared/file-utils");
const filePath = "./data/progress.json";

//read file
async function getAllProgress() {
  return readFile(filePath);
}

//find lesson by id
async function getProgressByUserId(userId) {
  if (!userId) throw new Error(`Cannot use ${userId} to get progress`);
  const allProgress = await getAllProgress();
  const foundProgress = allProgress.find(
    (progress) => progress.userId === userId
  );
  return foundProgress;
}

//Save progress
//Create progress if there's no progress for userId
//Update progress if there's existing progress for userId
async function addProgress(newProgress) {
  const allProgress = await getAllProgress();
  const index = allProgress.findIndex(
    (progress) => progress.userId === newProgress.userId
  );
  if (index < 0) {
    allProgress.push({ ...newProgress, updatedAt: new Date().toISOString() });
  } else {
    throw new Error(`user progress already exists`)
  }
  await writeToFile(filePath, allProgress);
  return newProgress;
}

async function updateProgress(newProgress) {
  const allProgress = await getAllProgress();
  const index = allProgress.findIndex(
    (progress) => progress.userId === newProgress.userId
  );
  if (index < 0) {
    throw new Error(`user progress doesn't exist`);
  } else {
    allProgress[index] = {
      ...allProgress[index],
      ...newProgress,
      updatedAt: new Date().toISOString(),
    };
  }
  await writeToFile(filePath, allProgress);
  return newProgress;
}

module.exports = {
  getAllProgress,
  getProgressByUserId,
  addProgress,
  updateProgress
};
