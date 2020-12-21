import { FTestCase, testFuncs } from '../test';

function readData(line: string) {
  let allergRegex = new RegExp(
    '^contains ([a-z ,]+)\\)$');
  let [a,b] = line.split('(', 2);
  let ingred = a.trim().split(' ');
  let allerg = b
    ? allergRegex.exec(b)[1].split(',').map(x => x.trim())
    : '';
  return [ingred,allerg];
}

function solvePart1(lines: string[]) {
  let data = lines.map(readData);
  console.log(data);
  return 0;
}

const testCases: FTestCase<string[],number>[] = [
  [ solvePart1,
    [ 'mxmxvkd kfcds sqjhc nhms (contains dairy, fish)',
      'trh fvjkl sbzzf mxmxvkd (contains dairy)',
      'sqjhc fvjkl (contains soy)',
      'sqjhc mxmxvkd sbzzf (contains fish)',
    ],
    5 ],
];

export function run(fileData: string) {
  testFuncs(testCases);

  let lines = fileData.split('\n');
  console.log(`Part1: ${solvePart1(lines)}`);
}
