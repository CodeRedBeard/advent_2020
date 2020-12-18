import { sum, notEmpty } from '../util';
import { testFuncs, FTestCase } from '../test';

type Operator = '+' | '*' | '(';
interface Precedence {
  ['+']: number;
  ['*']: number;
}

function evalExpr(str: string, prec: Precedence): number {
  let rpn: (number | Operator)[] = [];
  let opStack: Operator[] = [];
  for (let c of str) {
    switch (c) {
      default:
        rpn.push(Number(c));
        break;
      case ' ': break;
      case '(':
        opStack.push(c);
        break;
      case '+':
      case '*':
        while (opStack.length > 0) {
          let topOp = opStack[opStack.length-1];
          if (topOp !== '('
            && prec[topOp] >= prec[c]) {
            rpn.push(opStack.pop());
          }
          else {
            break;
          }
        }
        opStack.push(c);
        break;
      case ')':
        while (opStack.length > 0) {
          let op = opStack.pop();
          if (op === '(') {
            break;
          }
          rpn.push(op);
        }
        break;
    }
  }
  while (opStack.length > 0) {
    rpn.push(opStack.pop());
  }

  let evalStack: number[]=[];
  for (let x of rpn) {
    if (typeof x === 'number') {
      evalStack.push(x);
    }
    else {
      let b = evalStack.pop();
      let a = evalStack.pop();
      if (x === '+') {
        evalStack.push(a + b);
      }
      else if (x === '*') {
        evalStack.push(a * b);
      }
      else {
        throw new Error();
      }
    }
  }
  return evalStack[0];
}

function evalExpr1(str: string) {
  return evalExpr(str, {
    '*': 1,
    '+': 1,
  });
}

function evalExpr2(str: string) {
  return evalExpr(str, {
    '*': 1,
    '+': 2,
  });
}

function solvePart1(lines: string[]) {
  let values = lines.map(evalExpr1);
  return values.reduce(sum);
}

function solvePart2(lines: string[]) {
  let values = lines.map(evalExpr2);
  return values.reduce(sum);
}

const testCases: FTestCase<string,number>[] = [
  [ evalExpr1,
    '2 * 3 + (4 * 5)',
    26],
  [ evalExpr1,
    '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2',
    13632],
  [ evalExpr2,
    '2 * 3 + (4 * 5)',
    46],
];

export function run(fileData: string) {
  testFuncs(testCases);

  let lines = fileData.split('\n').filter(notEmpty);
  console.log(`Part1: ${solvePart1(lines)}`);
  console.log(`Part2: ${solvePart2(lines)}`);
}
