const { readFile } = require("../../shared/file-utils")
const filePath = "./data/lessons.json"

//read file
async function getAllLessons() {
    return readFile(filePath);
}

//find lesson by id
async function getLessonById(lessonId) {
    if (!lessonId) throw new Error(`Cannot use ${lessonId} to get users`);
    const allLessons = await getAllLessons();
    const foundLesson = allLessons.find((lesson) => lesson.id === lessonId);
    return foundLesson;
}

//search lesson by keyword
async function searchLesson(keyword) {
    const allLessons = await getAllLessons();
    if (!keyword) return allLessons;

    const lowerKeyword = keyword.toLowerCase();
    const results = allLessons.filter((lesson) => lesson.title.toLowerCase().includes(lowerKeyword));
    return results;
}

//filter lesson by level
async function filterLesson(level) {
    const allLessons = await getAllLessons();
    if (!level) return allLessons;

    const lowerKeyword = keyword.toLowerCase();
    const results = allLessons.filter((lesson) => lesson.level === level);
    return results;
}

module.exports = {
    getAllLessons,
    getLessonById,
    searchLesson,
    filterLesson
 }