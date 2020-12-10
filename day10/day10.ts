import { notEmpty } from '../util';

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
  let numPaths = new Array<number>();
  let prev3 = [0];
  for (const [idx, x] of lines.entries()) {
    prev3 = prev3.filter(p => (x - p) <= 3);
    numPaths.push(prev3.length);
    prev3.push(x);
  }
  return numPaths.reduce((a,b) => a * b);
}

export function run(fileData: string) {
  let lines = fileData.split('\n')
    .filter(notEmpty)
    .map(Number);

  let result_1 = solvePart1(lines);
  console.log(`Part1: ${result_1}`);

  let result_2 = solvePart2(lines);
  console.log(`Part2: ${result_2}`);
}
