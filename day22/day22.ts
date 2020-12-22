import { FTestCase, testFuncs } from '../test';
import { readInputFile, sum } from '../util';

function readInput(input: string) {
  return input.split('\n\n')
    .map(x => x.trim()
      .split('\n')
      .slice(1)
      .map(Number));
}

function playGame(input: string) {
  let decks = readInput(input);
  let [da,db] = decks;
  while (da.length > 0 && db.length > 0) {
    let a = da.shift();
    let b = db.shift();
    let winner = (a > b) ? da : db;
    let max = Math.max(a,b);
    let min = Math.min(a,b);
    winner.push(max);
    winner.push(min);
  }
  return [da,db];
}

function solvePart1(input: string) {
  let results = playGame(input);
  let winner = results.filter(x => x.length !== 0)[0];
  let bottomUp = winner.slice().reverse();
  let score = bottomUp.map((v,idx) => v * (1+idx))
    .reduce(sum);
  return score;
}

const testCases: FTestCase<string,number>[] = [
  [ solvePart1,
    readInputFile('day22/test1.txt'),
    306 ],
];

export function run(fileData: string) {
  testFuncs(testCases);

  console.log(`Part1: ${solvePart1(fileData)}`);
}
