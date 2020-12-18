import { sum, notEmpty } from '../util';
import { testFuncs, FTestCase } from '../test';

type Operator = '+' | '*' | '(';

function evalExpr(str: string): number {
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
        while (opStack.length > 0
          && opStack[opStack.length-1] !== '(') {
          rpn.push(opStack.pop());
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

function solvePart1(lines: string[]) {
  let values = lines.map(evalExpr);
  return values.reduce(sum);
}

const testCases: FTestCase<string,number>[] = [
  [ evalExpr,
    '2 * 3 + (4 * 5)',
    26],
  [ evalExpr,
    '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2',
    13632],
];

export function run(fileData: string) {
  testFuncs(testCases);

  let lines = fileData.split('\n').filter(notEmpty);
  console.log(`Part1: ${solvePart1(lines)}`);
}
