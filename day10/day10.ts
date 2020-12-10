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
  for (const x of lines) {
    
  }
}

export function run(fileData: string) {
  let lines = fileData.split('\n')
    .filter(notEmpty)
    .map(Number);

  let result_1 = solvePart1(lines);
  console.log(`Part1: ${result_1}`);
}
