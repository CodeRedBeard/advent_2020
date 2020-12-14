import { FTestCase, test, testFuncs } from "../test";
import { notEmpty } from "../util";

enum MaskBit {
  Ignore,
  Zero,
  One,
}

const bitValues: number[] = [];
for (let x = 0; x < 36; ++x) {
  bitValues.push(Math.pow(2, x));
}

function toBinary(num: number): boolean[] {
  let result: boolean[] = [];
  for (let x = 35; x >= 0; --x) {
    if (num >= bitValues[x]) {
      result.push(true);
      num -= bitValues[x];
    }
    else {
      result.push(false);
    }
  }
  return result.reverse();
}

function fromBinary(bin: boolean[]): number {
  let result = 0;
  for (let x = 0; x < 36; ++x) {
    if (bin[x]) {
      result += bitValues[x];
    }
  }
  return result;
}

function readBitmask(line: string): MaskBit[] {
  let result: MaskBit[] = [];
  let maskStr = line.substring(7);
  for (const c of maskStr) {
    switch (c) {
      default:
      case 'X': result.push(MaskBit.Ignore); break;
      case '0': result.push(MaskBit.Zero); break;
      case '1': result.push(MaskBit.One); break;
    }
  }
  return result.reverse();
}

const memRegex = new RegExp('^mem\[(\d+)\] = (\d+)$');
function execLine(line: string) {
  if (line.startsWith('mem')) {
    let memDetail = memRegex.exec(line);
    let addr = memDetail[0];
    let value = memDetail[1];
  }
  else if (line.startsWith('mask')) {
    let mask = readBitmask(line);
  }
}

function solvePart1(lines: string[]): number {
  return 0;
}

function binaryRoundtrip(num: number): number {
  return fromBinary(toBinary(num));
}
const testBinary: FTestCase<number, number>[] = [
  [binaryRoundtrip, 0, 0],
  [binaryRoundtrip, 1, 1],
  [binaryRoundtrip, 15, 15],
  [binaryRoundtrip, 16, 16],
  [binaryRoundtrip, 8589934592, 8589934592],
];
const testCases: FTestCase<string[], number>[] = [
  [ solvePart1,
    [ 'mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X',
      'mem[8] = 11',
      'mem[7] = 101',
      'mem[8] = 0',
    ],
    165,
  ],
];

export function run(fileData: string) {
  testFuncs(testBinary);
  testFuncs(testCases);
  let lines = fileData.split('\n').filter(notEmpty);
}