import { FTestCase, testFuncs } from "../test";
import { notEmpty } from "../util";

function evalTurnX(startNums: number[], turnX: number): number {
  let spoken = startNums.slice().reverse();
  for (let x = startNums.length; x < turnX; ++x) {
    let next = 0;
    const last = spoken[0];
    const prevIdx = spoken.indexOf(last, 1);
    if (prevIdx > 0) {
      next = prevIdx;
    }
    spoken.unshift(next);
  }
  return spoken[0];
}

function solvePart1(startNums: number[]): number {
  return evalTurnX(startNums, 2020);
}

const testCases: FTestCase<number[], number>[] = [
  [ solvePart1,
    [0,3,6],
    436,
  ],
  [ solvePart1,
    [1,3,2],
    1,
  ],
  [ solvePart1,
    [2,1,3],
    10,
  ],
  [ solvePart1,
    [3,1,2],
    1836,
  ],
]

export function run(fileData: string) {
  testFuncs(testCases);

  let starts = fileData.split(',')
    .filter(notEmpty)
    .map(Number);

    console.log(`Part1: ${solvePart1(starts)}`);
}