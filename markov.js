"use strict"

/** Textual markov chain generator */


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.chains = this.makeChains(words);
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains(words) {
    let chains = {};

    for (let i = 0; i < words.length; i++) {
      let nextWord = words[i + 1] || null;
      if (chains[words[i]]) {
        chains[words[i]].push(nextWord);
      }
      else {
        chains[words[i]] = [nextWord];
      }
    }
    // console.log("Chains: ", chains)
    return chains;
  }


  /** return random text from chains */

  getText(numWords=100) {
    // Find all the capital words 
    // To start on words that begin the sentence
    // - Split on ".", grab all the first words, make 
    //   sure to start on one of these words
    let capWords = Object.keys(this.chains).filter((word) => {
      return word && word[0] === word[0].toUpperCase();
    });

    let startIndex = Math.floor(Math.random() * capWords.length)
    let words = [capWords[startIndex]];

    for (let i = 0; i < numWords; i++) {
      // pick one from chain
      let nextWord = this._getNextWord(words[i]);

      // console.log("next word:",nextWord);
      if (nextWord === null){
        break;
      }

      // add to words
      words.push(nextWord);
    }

    while(!words[words.length - 1].endsWith(".")){
      words.pop();
    }

    return words.join(" ");
  }

  /** Given a word return a possible word using markov chain */

  _getNextWord(word) {
    // find chain of possible words
    let chain = this.chains[word];

    // pick one from chain
    return chain[Math.floor(Math.random() * chain.length)];
  }
}


class BiGramMarkovMachine extends MarkovMachine {
  
  /** set bigram markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the cat": ["in"], "cat in": ["the"], "in the": ["hat"], "the hat": [null]} */

  makeChains(words) {
    let chains = {};

    for (let i = 0; i < words.length - 1; i++) {
      let currentPhrase = words[i] + " " + words[i + 1];
      let nextWord = words[i + 2] || null;

      if (chains[currentPhrase]) {
        chains[currentPhrase].push(nextWord);
      }
      else {
        chains[currentPhrase] = [nextWord];
      }
    }
    return chains;
  }

  getText(numWords=100) {
    // Find all the bigram phrases that begin with
    // a capital letter
    let capWords = Object.keys(this.chains).filter((word) => {
      return word && word[0] === word[0].toUpperCase();
    });

    let startIndex = Math.floor(Math.random() * capWords.length)
    let words = [...capWords[startIndex].split(" ")];

    for (let i = 1; i < numWords; i++) {
      // pick one from chain
      let nextWord = this._getNextWord(words[i - 1] + " " + words[i]);

      // console.log("next word:",nextWord);
      if (nextWord === null){
        break;
      }

      // add to words
      words.push(nextWord);
    }

    // Remove the words that do not finish the sentence
    while(!words[words.length - 1].endsWith(".")){
      words.pop();
    }

    return words.join(" ");
  }
}

module.exports = { BiGramMarkovMachine };

// let mm = new MarkovMachine("the cat in the hat");
// console.log("I'm going to tell you a story: ", mm.getText());
// console.log(mm.chains);
