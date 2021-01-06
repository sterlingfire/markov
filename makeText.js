"use strict";

const axios = require('axios');
const fsP = require('fs/promises');
const { BiGramMarkovMachine } = require('./markov');
const encoding = "utf8";

/** Command-line tool to generate Markov text.
 *  Example: $ node makeText.js file eggs.txt
 *  Example2: $ node makeText.js url http://www.gutenberg.org/files/11/11-0.txt
 */
async function main() {
  let text = await getTextFromSource();
  let mm = new BiGramMarkovMachine(text);
  console.log(mm.getText());
}

/* Helper function to parse command line args
 * returns text from the source (URL or file)
 */
async function getTextFromSource(){
  let text;
  if (process.argv[2] === 'file') {
    let filePath = process.argv[3];
    text = await cat(filePath);
  }
  else if (process.argv[2] === 'url') {
    let url = process.argv[3];
    text = await webCat(url);
  }
  else {
    console.error(`Bad input. Please try again.
    * Example: $ node makeText.js file eggs.txt
    * Example2: $ node makeText.js url http://www.gutenberg.org/files/11/11-0.txt`);
    process.exit(1);
  }
  return text;
}

/** Prints to the console the contents of the
 *  file in the path receivedx
 *  - If error occurs, show the error message
 */
async function cat(path) {
  let content;
  try {
    content = await fsP.readFile(path, encoding);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  return content;
}

/** Show the contents received from the axios request
 *  on the console
 *  - If error occurs, show the error message with
 *    the status code of the error and exit the program
 */
async function webCat(url) {
  let content;

  try {
    content = await axios.get(url);
  } catch (err) {
    console.error(`Error fetching ${url}:`);
    console.error(`Error: Request failed with status code ${err.response.status}`);
    process.exit(1);
  }
  return content.data;
}

main();
