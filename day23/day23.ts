import { FTestCase, testFuncs } from '../test';

function doMove(cups: number []) {
  let cur = cups[0];
  let out = cups.splice(1,3);
  let max = Math.max(...cups);
  let min = Math.min(...cups);
  function wrapToMax(x: number) {
    if (x < min) {
      return max;
    }
    return x;
  }
  let next = wrapToMax(cur - 1);
  while (!cups.includes(next)) {
    next = wrapToMax(next - 1);
  }
  let nextIdx = cups.indexOf(next);
  cups.splice(nextIdx + 1, 0, ...out);
  cups.push(cups.shift());
  //console.log(cups);
}

function doMoves(numMoves: number) {
  return (input: string) => {
    let cups = input.trim().split('').map(Number);
    for (let x = 0; x < numMoves; ++x) {
      doMove(cups);
    }
    let index1 = cups.indexOf(1);
    return cups.slice(index1+1)
      .concat(cups.slice(0, index1))
      .join('');
  }
}

function solvePart1(input: string) {
  return doMoves(100)(input);
}

const testCases: FTestCase<string,string>[] = [
  [ solvePart1,
    '389125467',
    '67384529'],
];

export function run(fileData: string) {
  testFuncs(testCases);

  console.log(`Part1: ${solvePart1(fileData)}`);
}
