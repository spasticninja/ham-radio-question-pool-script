const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const isEmptyObject = (obj) => {
  if (JSON.stringify(obj) === '{}') {
    return true;
  } else {
    return false;
  }
}

const clearEmptyLines = (arr) => {
  let cleanedArray = [];
  arr.forEach((line) => {
    if (line.trim() !== "") {
      cleanedArray.push(line);
    }
  });
  return cleanedArray;
}

const convertToJSON = async () => {
  // const file = await readFile('./Technician Pool and Syllabus 2022-2026 Public Release Errata March 7 2022.txt', {encoding: 'utf8'});
  const file = await readFile(process.argv[2], {encoding: 'utf8'});
  let outputJSON = {};
  let questionBank = [];

  // subelements array
  const fileByLine = clearEmptyLines(file.split('\n'));
  let question = {};
  let questionAnsOptions = {};
  let questionIndex = -1;
  let questionStep = '';

  // going line-by-line
  fileByLine.forEach((line, ind) => {
    if (line.toLowerCase().includes('effective') && isEmptyObject(outputJSON)) {
      // Grab effective dates for output
      let newLine = line.slice(10);
      let dates = newLine.split('–');
      outputJSON['effectiveFromDate'] = dates[0].trim();
      outputJSON['effectiveToDate'] = dates[1].trim();
    } else if (line.match(/^T[0-9][A-Z][0-9]{1,2}/)) {
      // Find question by matching regex
      let lineData = line.split('(');
      if (!lineData[0].toLowerCase().includes('removed') && lineData.length >= 2) {
        // do not add answer with "removed" label to answer bank
        question['id'] = lineData[0].trim();
        question['answer'] = lineData[1].charAt(0);
        questionIndex = ind;
      }
    } else if (line.match('~~') && !isEmptyObject(question)) {
      // End of question syntax, add question options to question and push to bank
      question['options'] = questionAnsOptions;
      questionBank.push(question);
      
      // reset question related variables
      question = {};
      questionAnsOptions = {};
      questionIndex = -1;
      questionStep = '';
    } else {
      // question and answer options, ignoring spaces/empty questions
      if (questionIndex === ind - 1) {
        questionStep = 'Q';
        question['question'] = line.trim();
      } else if (line.includes('A.')) {
        questionStep = 'A';
        let optionIndex = line.indexOf('A.')
        questionAnsOptions['A'] = line.slice(optionIndex + 2).trim();
      } else if (line.includes('B.')) {
        questionStep = 'B';
        let optionIndex = line.indexOf('B.')
        questionAnsOptions['B'] = line.slice(optionIndex + 2).trim();
      } else if (line.includes('C.')) {
        questionStep = 'C';
        let optionIndex = line.indexOf('C.')
        questionAnsOptions['C'] = line.slice(optionIndex + 2).trim();
      } else if (line.includes('D.')) {
        questionStep = 'D';
        let optionIndex = line.indexOf('D.')
        questionAnsOptions['D'] = line.slice(optionIndex + 2).trim();
      } else {
        // Handling case for line break in the middle of a question or answer option
        if (questionStep === 'Q') {
          question['question'] = question['question'].concat(` ${line.trim()}`);
        } else if (questionStep && questionAnsOptions[`${questionStep}`]) {
          questionAnsOptions[`${questionStep}`] = questionAnsOptions[`${questionStep}`].concat(` ${line.trim()}`);
        }
      }
    }
  });

  // add questionBank to our outputJSON object
  outputJSON['questions'] = questionBank;

  // Write to file
  await writeFile('./test-pool/technician-questions.json', JSON.stringify(outputJSON, null, 2));
}

convertToJSON();
