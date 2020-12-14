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

function solvePart2(lines: string[]) {
  let routes = lines[1].split(',')
    .map((x, idx) => [Number(x), idx])
    .filter(x => !isNaN(x[0]));
  let t = 0;
  let harmonic = 1;
  for (const [freq,offset] of routes) {
    while ((t + offset) % freq !== 0) {
      t += harmonic;
    }
    harmonic *= freq;
  }
  return t;
}

const testCases: FTestCase<string[],number>[] = [
  [ solvePart1,
    [ '939',
      '7,13,x,x,59,x,31,19',
    ],
    295,
  ],
  [ solvePart2,
    [ 'x',
      '7,13,x,x,59,x,31,19',
    ],
    1068781,
  ],
  [ solvePart2,
    [ 'x',
      '17,x,13,19',
    ],
    3417,
  ],
  [ solvePart2,
    [ 'x',
      '67,7,59,61',
    ],
    754018,
  ],
]

export function run(fileData: string) {
  testFuncs(testCases);
  let lines = fileData.split('\n');

  console.log(`Part1: ${solvePart1(lines)}`);
  console.log(`Part2: ${solvePart2(lines)}`);
}
