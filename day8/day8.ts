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

function runLoopingCode(lines: string[]): number | undefined {
  const code = readCode(lines);
  const program: Program = {
    code: code.map(i => [i,0]),
    ip: 0,
    accum: 0,
  };
  while (program.ip < program.code.length) {
    const codeLine = program.code[program.ip];
    codeLine[1] += 1; // hit count
    if (codeLine[1] > 1) {
      return program.accum;
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
  return undefined;
}

function solvePart1(lines: string[]) {
  const breakPointAccum = runLoopingCode(lines);
  console.log(`Part1 (looping accumulator): ${breakPointAccum}`);
}

export function run(fileData: string) {
  test(runLoopingCode, testCases1);

  const lines = fileData.split('\n');
  solvePart1(lines);
}
