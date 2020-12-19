import { FTestCase, testFuncs } from '../test';
import { readInputFile, countOf } from '../util';

function splitTrim(str: string, c: string): string[] {
  return str.split(c).map(x => x.trim());
}

function parseRules(input: string, overrides: string[]) {
  function getLineRule(line: string): [number, string[][]] {
    let [idx,rest] = splitTrim(line, ':');
    let options = splitTrim(rest, '|')
      .map(x => splitTrim(x, ' '));
    return [Number(idx), options];
  }
  let lines = input.split('\n\n')[0].split('\n');
  let rules = new Map(lines.map(getLineRule));
  let overrideRules = overrides.map(getLineRule);
  for (const override of overrideRules) {
    rules.set(override[0], override[1]);
  }
  //console.log(rules.entries())
  function makeExpr(idx: number): string {
    let options = rules.get(idx);
    if (!options) {
      throw new Error(String(idx));
    }
    if (options.length === 1
      && options[0].length === 1
      && options[0][0][0] === '"') {
      return `[${options[0][0][1]}]`;
    }
    let subrules = options.map(
      opt => opt.map(Number).map(makeExpr).join(''));
    return `(${subrules.join('|')})`;
  }
  return new RegExp('^'+makeExpr(0)+'$');
}

function testLines(regex: RegExp, input: string) {
  let lines = input.split('\n\n')[1].split('\n');
  let matches = lines.map(line => regex.test(line));
  return countOf(matches, true);
}

function solvePart1(input: string) {
  let rules = parseRules(input, []);
  //console.log(rules);
  return testLines(rules, input);
}

function solvePart2(input: string) {
  // This is a horrible hack, but it's enough for the given inputs
  let rules = parseRules(input,
    [
      '8: 42 | 42 42 | 42 42 42 | 42 42 42 42 | 42 42 42 42 42 | 42 42 42 42 42 42 | 42 42 42 42 42 42 42 | 42 42 42 42 42 42 42 42',
      '11: 42 31 | 42 42 31 31 | 42 42 42 31 31 31 | 42 42 42 42 31 31 31 31 | 42 42 42 42 42 31 31 31 31 31 | 42 42 42 42 42 42 31 31 31 31 31 31',
    ]);
  //console.log(rules);
  return testLines(rules, input);
}

const testCases: FTestCase<string,number>[] = [
  [ solvePart1,
    readInputFile('day19/test1.txt'),
    2 ],
  [ solvePart2,
    readInputFile('day19/test2.txt'),
    12 ],
];

export function run(fileData: string) {
  testFuncs(testCases);

  console.log(`Part1: ${solvePart1(fileData)}`);
  console.log(`Part2: ${solvePart2(fileData)}`);
}
