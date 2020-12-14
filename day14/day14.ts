import { FTestCase, test, testFuncs } from "../test";
import { notEmpty, sum } from "../util";

enum MaskBit {
  Ignore,
  Zero,
  One,
}
type Bitmask = MaskBit[];
type Binary = boolean[];

const bitValues: number[] = [];
for (let x = 0; x < 36; ++x) {
  bitValues.push(Math.pow(2, x));
}

function toBinary(num: number): Binary {
  let result: Binary = [];
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

function fromBinary(bin: Binary): number {
  let result = 0;
  for (let x = 0; x < 36; ++x) {
    if (bin[x]) {
      result += bitValues[x];
    }
  }
  return result;
}

function applyMask(bin: Binary, mask: Bitmask) {
  for (let x =0; x<bin.length; ++x) {
    switch (mask[x]) {
      default: break;
      case MaskBit.Zero: bin[x] = false; break;
      case MaskBit.One:  bin[x] = true;  break;
    }
  }
}

function readBitmask(line: string): Bitmask {
  let result: Bitmask = [];
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

interface State {
  memory: Map<number, number>;
  mask: Bitmask;
}
const memRegex = new RegExp('^mem\\[(\\d+)\\] = (\\d+)$');
function execLine(line: string, state: State) {
  if (line.startsWith('mem')) {
    let memDetail = memRegex.exec(line);
    let addr = Number(memDetail[1]);
    let value = Number(memDetail[2]);
    let binValue = toBinary(value);
    applyMask(binValue, state.mask);
    let maskedValue = fromBinary(binValue);
    state.memory.set(addr, maskedValue);
  }
  else if (line.startsWith('mask')) {
    state.mask = readBitmask(line);
  }
}

function solvePart1(lines: string[]): number {
  let state: State ={
    memory: new Map(),
    mask: [],
  };
  for (let line of lines) {
    execLine(line, state);
  }
  //console.log(Array.from(state.memory.entries()));
  return Array.from(state.memory.values())
    .reduce(sum, 0);
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

  console.log(`Part1: ${solvePart1(lines)}`);
}
