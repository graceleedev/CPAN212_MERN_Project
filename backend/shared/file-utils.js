const fs = require("fs");

async function readFile(filename) {
  try {
    const file = fs.readFileSync(filename, "utf-8");
    return JSON.parse(file);
  } catch (error) {
    throw new Error(`Couldn't read file ${filename}`);
  }
}

async function writeToFile(filename, updated) {
  try {
    const data = JSON.stringify(updated);
    fs.writeFileSync(filename, data, "utf-8");
  } catch (error) {
    throw new Error(`Couldn't write into file ${filename}`);
  }
}

module.exports = { readFile, writeToFile };
