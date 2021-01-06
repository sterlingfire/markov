"use strict"

const { MarkovMachine } = require("./markov");


describe("MarkovMachine", function () {
  let mm;
  let mm2;
  let mm3;

  beforeAll(function () {
    mm = new MarkovMachine("the cat in the hat");
    mm2 = new MarkovMachine("the book is red");
    mm3 = new MarkovMachine("");
  });


  test("Correctly creates the chains", function () {
    expect(mm.chains).toEqual({
      the: ['cat', 'hat'],
      cat: ['in'],
      in: ['the'],
      hat: [null]
    });

    expect(mm2.chains).toEqual({
      the: ['book'],
      book: ['is'],
      is: ['red'],
      red: [null]
    });

    expect(mm3.chains).toEqual({
      "": [null]
    });
  });

  test("Check that the next word is correctly returned", function () {
    expect(mm._getNextWord("hat")).toBeNull();
    expect(mm._getNextWord("in")).toEqual("the");
    expect(mm._getNextWord("the")).toEqual(expect.any(String));

    expect(mm2._getNextWord("the")).toEqual("book");
    expect(mm2._getNextWord("is")).toEqual("red");
    expect(mm2._getNextWord("red")).toBeNull();
  });

  test("Check that a sample text is returned", function () {
    let mmWords = mm.getText().split(" ");
    // check pairs are valid chains
    for (let i = 0; i < mmWords.length - 1; i++) {
      expect(mm.chains[mmWords[i]]).toContain(mmWords[i + 1]);
    }
    expect(mm.chains[mmWords[mmWords.length - 1]]).toContain(null);
  })
    test("Check that a sample text is returned (example2)", function () {
    let mm2Words = mm2.getText().split(" ");
    // check pairs are valid chains
    for (let i = 0; i < mm2Words.length - 1; i++) {
      expect(mm2.chains[mm2Words[i]]).toContain(mm2Words[i + 1]);
    }
    expect(mm2.chains[mm2Words[mm2Words.length - 1]]).toContain(null);
  });
});
