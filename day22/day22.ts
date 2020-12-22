import { FTestCase, testFuncs } from '../test';
import { readInputFile, sum } from '../util';

type Deck = number[];
type Decks = [Deck, Deck];

function readInput(input: string): Decks {
  let decks = input.split('\n\n')
    .map(x => x.trim()
      .split('\n')
      .slice(1)
      .map(Number));
  return [decks[0], decks[1]];
}

function decksEqual(memo: Decks, newState: Decks): boolean {
  for (let d = 0; d < memo.length; ++d) {
    let memoDeck = memo[d];
    let newDeck = newState[d];
    if (memoDeck.length !== newDeck.length) {
      return false;
    }
    for (let n = 0; n < memoDeck.length; ++n) {
      if (memoDeck[n] !== newDeck[n]) {
        return false;
      }
    }
  }
  return true;
}

function playGame(input: string): Decks {
  let decks = readInput(input);
  let [da,db] = decks;
  while (da.length > 0 && db.length > 0) {
    let a = da.shift();
    let b = db.shift();
    let winDeck = (a > b) ? da : db;
    let max = Math.max(a,b);
    let min = Math.min(a,b);
    winDeck.push(max);
    winDeck.push(min);
  }
  return [da,db];
}

function playGameRecursive(input: string) {
  function innerGame(decks: Decks): { winner: 1 | 2 } {
    let memos = new Array<Decks>();
    let [da,db] = decks;
    while (da.length > 0 && db.length > 0) {
      for (let memo of memos) {
        if (decksEqual(memo, decks)) {
          return { winner: 1 };
        }
      }
      memos.push([da.slice(), db.slice()]);
      let a = da.shift();
      let b = db.shift();
      let winner: 1 | 2;
      if (da.length >= a && db.length >= b) {
        let subGameResult = innerGame([da.slice(0, a), db.slice(0, b)]);
        winner = subGameResult.winner;
      }
      else {
        winner = (a > b) ? 1 : 2;
      }
      let winDeck = (winner === 1) ? da : db;
      let winCard = (winner === 1) ? a : b;
      let loseCard = (winner === 1) ? b : a;
      winDeck.push(winCard);
      winDeck.push(loseCard);
    }
    return { winner: (da.length > 0) ? 1 : 2 };
  }

  let outerDecks = readInput(input);
  innerGame(outerDecks);
  return outerDecks;
}

function scoreGame(results: number[][]): number {
  let winner = results.filter(x => x.length !== 0)[0];
  let bottomUp = winner.slice().reverse();
  let score = bottomUp.map((v,idx) => v * (1+idx))
    .reduce(sum);
  return score;
}

function solvePart1(input: string) {
  let results = playGame(input);
  return scoreGame(results);
}

function solvePart2(input: string) {
  let results = playGameRecursive(input);
  return scoreGame(results);
}

const testCases: FTestCase<string,number>[] = [
  [ solvePart1,
    readInputFile('day22/test1.txt'),
    306 ],
  [ solvePart2,
    readInputFile('day22/test1.txt'),
    291 ],
];

export function run(fileData: string) {
  testFuncs(testCases);

  console.log(`Part1: ${solvePart1(fileData)}`);
  console.log(`Part2: ${solvePart2(fileData)}`);
}
