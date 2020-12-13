import { FTestCase, testFuncs } from '../test';

function solvePart1(lines: string[]) {
  let target = Number(lines[0]);
  let routes = lines[1].split(',')
    .map(Number)
    .filter(x => !isNaN(x));
  for (let t = target; ; ++t) {
    for (let r of routes) {
      let k = t / r;
      if (k === Math.floor(k)) {
        return r * (t - target);
      }
    }
  }
}

const testCases: FTestCase<string[],number>[] = [
  [ solvePart1,
    [ '939',
      '7,13,x,x,59,x,31,19',
    ],
    295,
  ],
]
export function run(fileData: string) {
  testFuncs(testCases);
  let lines = fileData.split('\n');

  console.log(`Part1: ${solvePart1(lines)}`);
}
