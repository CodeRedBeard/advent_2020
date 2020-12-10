import { test, TestCase } from '../test';
import { notEmpty } from '../util';

const testCases2: TestCase<number[], number>[] = [
  [
    [16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4,
    ], 8],
  [
    [28, 33, 18, 42, 31, 14, 46, 20, 48, 47, 24,
      23, 49, 45, 19, 38, 39, 11, 1, 32, 25, 35,
      8, 17, 7, 9, 4, 2, 34, 10, 3,
    ], 19208],
];

function sortLines(lines: number[]) {
  lines = lines.slice();
  lines.sort((a,b) => a - b);
  //console.log(lines);
  lines.push(3 + lines[lines.length - 1]);

  return lines;
}

function solvePart1(lines: number[]) {
  lines = sortLines(lines);
  let jolts = {
    [1]: 0,
    [2]: 0,
    [3]: 0,
  };
  let prev = 0;
  for (const x of lines) {
    const diff = x - prev;
    if (!(diff===1 || diff===2 || diff===3)) {
      throw new Error(`bad diff: ${diff} to ${x}`);
    }
    jolts[diff] += 1;
    prev = x;
  }

  return jolts[1] * jolts[3];
}

function solvePart2(lines: number[]) {
  lines = sortLines(lines);
  lines.unshift(0);
  let numPaths = [1];
  for (let idx = 1; idx < lines.length; ++idx) {
    const x = lines[idx];
    let sum = 0;
    for (let n = Math.max(0, idx - 3); n < idx; ++n) {
      if (x - lines[n] > 3) {
        continue;
      }
      sum += numPaths[n];
    }
    numPaths.push(sum);
  }
  return numPaths[numPaths.length - 1];
}

export function run(fileData: string) {
  test(solvePart2, testCases2);

  let lines = fileData.split('\n')
    .filter(notEmpty)
    .map(Number);

  let result_1 = solvePart1(lines);
  console.log(`Part1: ${result_1}`);

  let result_2 = solvePart2(lines);
  console.log(`Part2: ${result_2}`);
}
