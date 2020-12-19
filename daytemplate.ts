import { FTestCase, testFuncs } from '../test';

function solvePart1(lines: string[]) {
  return 0;
}

const testCases: FTestCase<string,number>[] = [
];

export function run(fileData: string) {
  testFuncs(testCases);

  let lines = fileData.split('\n');
  console.log(`Part1: ${solvePart1(lines)}`);
}
