import { FTestCase, testFuncs } from '../test';
import { notEmpty } from '../util';

function transformCycle(value: number, subj: number) {
  value = value * subj;
  value = value % 20201227;
  return value;
}

function doTransform(subj: number, loops: number) {
  let value = 1;
  for (let x = 0; x < loops; ++x) {
    value = transformCycle(value, subj);
  }
  return value;
}

function findLoops(targ: number, subj: number) {
  let loopSize = 0;
  let value = 1;
  while (value !== targ) {
    value = transformCycle(value, subj);
    ++loopSize;
  }
  return loopSize;
}

function solvePart1(lines: number[]) {
  let loops = lines.map(x => findLoops(x, 7));
  console.log(loops);
  let key0 = doTransform(lines[0], loops[1]);
  let key1 = doTransform(lines[1], loops[0]);
  if (key0 !== key1) {
    throw new Error();
  }
  return key0;
}

const testCases: FTestCase<string,number>[] = [
];

export function run(fileData: string) {
  testFuncs(testCases);

  let lines = fileData.split('\n')
    .filter(notEmpty)
    .map(Number);
  console.log(`Part1: ${solvePart1(lines)}`);
}
