import { test, TestCase } from '../test';
import { tuple } from '../util';

const testCases1: TestCase<string[], number>[] = [
  [[
    'nop +0',
    'acc +1',
    'jmp +4',
    'acc +3',
    'jmp -3',
    'acc -99',
    'acc +1',
    'jmp -4',
    'acc +6',
  ], 5],
];
const testCases2: TestCase<string[], number>[] = [
  [testCases1[0][0], 8],
];

const validOps = tuple(
  'acc',
  'jmp',
  'nop',
)
type ValidOps = (typeof validOps)[number];

interface Instruction {
  op: ValidOps;
  arg: number;
}
interface Program {
  code: [Instruction, number][];
  ip: number;
  accum: number;
}

function readCode(lines: string[]): Instruction[] {
  function lineToInstr(line: string) {
    const [op,arg] = line.split(' ');
    const validOp = validOps.find(v => v === op);
    const validArg = parseInt(arg, 10);
    return { op: validOp, arg: validArg };
  }
  return lines.map(lineToInstr);
}

type AccumResult = {exit: 'loop' | 'nex' | 'valid', accum: number};
function runLoopingCode(code: Instruction[]): AccumResult {
  const program: Program = {
    code: code.map(i => [i,0]),
    ip: 0,
    accum: 0,
  };
  while (program.ip < program.code.length) {
    const codeLine = program.code[program.ip];
    codeLine[1] += 1; // hit count
    if (codeLine[1] > 1) {
      return {
        exit: 'loop',
        accum: program.accum,
      };
    }
    const [instr] = codeLine;
    switch (instr.op) {
      case 'acc': {
        program.accum += instr.arg;
        program.ip += 1;
        break;
      }
      case 'jmp': {
        program.ip += instr.arg;
        break;
      }
      case 'nop': {
        program.ip += 1;
        break;
      }
    }
  }
  if (program.ip !== program.code.length) {
    return {
      exit: 'nex',
      accum: program.accum,
    };
  }
  return {
    exit: 'valid',
    accum: program.accum,
  };
}

function mutateCode(index: number, inCode: Instruction[]): Instruction[] {
  const outCode = inCode.map(x => Object.assign({}, x));
  const instr = outCode[index];
  if (instr.op === 'nop') {
    instr.op = 'jmp';
  }
  else if (instr.op === 'jmp') {
    instr.op = 'nop';
  }
  return outCode;
}

function solvePart1(lines: string[]): number {
  const code = readCode(lines);
  const result = runLoopingCode(code);
  if (result.exit !== 'loop') {
    throw new Error();
  }
  return result.accum;
}

function solvePart2(lines: string[]): number | undefined {
  const initCode = readCode(lines);
  for (let x = 0; x < initCode.length; ++x) {
    const code = mutateCode(x, initCode);
    const result = runLoopingCode(code);
    if (result.exit === 'valid') {
      return result.accum;
    }
  }
  return undefined;
}

export function run(fileData: string) {
  test(solvePart1, testCases1);
  test(solvePart2, testCases2);

  const lines = fileData.split('\n');

  const breakPointAccum = solvePart1(lines);
  console.log(`Part1 (looping accumulator): ${breakPointAccum}`);

  const fixedAccum = solvePart2(lines);
  console.log(`Part2 (uncorrupted): ${fixedAccum}`);
}
