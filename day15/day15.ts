import { FTestCase, testFuncs } from "../test";
import { notEmpty } from "../util";

function evalTurnX(startNums: number[], turnX: number): number {
  const lastSpoken = new Map<number,number>(startNums.slice(0, startNums.length - 1).map((val,idx) => [val, idx + 1]));
  let last = startNums[startNums.length - 1];
  for (let turn = startNums.length; turn < turnX; ++turn) {
    const prevIdx = lastSpoken.get(last);
    const next = (prevIdx !== undefined) ? (turn - prevIdx) : 0;
    lastSpoken.set(last, turn);
    last = next;
  }
  return last;
}

function solvePart1(startNums: number[]): number {
  return evalTurnX(startNums, 2020);
}

function solvePart2(startNums: number[]): number {
  return evalTurnX(startNums, 30000000);
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
  [ solvePart2,
    [0,3,6],
    175594,
  ],
  [ solvePart2,
    [1,3,2],
    2578,
  ],
  [ solvePart2,
    [2,1,3],
    3544142,
  ],
  [ solvePart2,
    [3,1,2],
    362,
  ],
]

export function run(fileData: string) {
  testFuncs(testCases);

  let starts = fileData.split(',')
    .filter(notEmpty)
    .map(Number);

    console.log(`Part1: ${solvePart1(starts)}`);
    console.log(`Part2: ${solvePart2(starts)}`);
}