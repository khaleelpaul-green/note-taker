const fs = require('fs');
const util = require('util');

const writeToFile = (destination, content) =>
fs.writeFile(destination, JSON.stringify(content), (err) =>
  err ? console.error(err) : console.info(`\nData written to ${destination}`)
);

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
};

const readFromFile = util.promisify(fs.readFile);

module.exports = { readAndAppend, writeToFile, readFromFile }