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
    let startIndex = Math.floor(Math.random() * Object.keys(this.chains).length)
    let words = [Object.keys(this.chains)[startIndex]];
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

module.exports = { MarkovMachine };

// let mm = new MarkovMachine("the cat in the hat");
// console.log("I'm going to tell you a story: ", mm.getText());
// console.log(mm.chains);
