import { test, TestCase } from "../test";
import { notEmpty, sum } from "../util";

const testRules1 = [
  'light red bags contain 1 bright white bag, 2 muted yellow bags.',
  'dark orange bags contain 3 bright white bags, 4 muted yellow bags.',
  'bright white bags contain 1 shiny gold bag.',
  'muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.',
  'shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.',
  'dark olive bags contain 3 faded blue bags, 4 dotted black bags.',
  'vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.',
  'faded blue bags contain no other bags.',
  'dotted black bags contain no other bags.',
];
const testRules2 = [
  'shiny gold bags contain 2 dark red bags.',
  'dark red bags contain 2 dark orange bags.',
  'dark orange bags contain 2 dark yellow bags.',
  'dark yellow bags contain 2 dark green bags.',
  'dark green bags contain 2 dark blue bags.',
  'dark blue bags contain 2 dark violet bags.',
  'dark violet bags contain no other bags.',
];
const testCases1: Array<TestCase<string[], number>> = [
  [testRules1, 4],
];
const testCases2: Array<TestCase<string[], number>> = [
  [testRules1, 32],
  [testRules2, 126],
];

type BagContent = [number,string];
type BagRules = Map<string,BagContent[]>;
type BagOuters = Map<string,string[]>;
function readRules(lines: string[]): BagRules {
  function readBagColor(arr: string[]) {
    return `${arr[0]}_${arr[1]}`;
  }
  function readContents(x: string[]): BagContent {
    let count = Number(x.shift());
    let color = readBagColor(x);
    x.shift();
    x.shift();
    x.shift();
    return [count, color];
  }
  function readLine(line: string): [string, BagContent[]] {
    let terms = line.split(' ');
    let color = readBagColor(terms);
    terms = terms.slice(4);
    if (terms[0] === 'no') {
      return [color, []];
    }
    let contents: BagContent[] = [];
    while (terms.length > 0) {
      contents.push(readContents(terms));
    }
    return [color, contents];
  }
  return new Map<string, BagContent[]>(lines.map(readLine));
}

function invertRules(rules: BagRules): BagOuters {
  let outers = new Map<string, string[]>();
  for (let [outColor, contents] of rules.entries()) {
    for (let inBag of contents) {
      let inColor = inBag[1];
      let o = outers.get(inColor) ?? [];
      o.push(outColor);
      outers.set(inColor, o);
    }
  }
  return outers;
}

function findOuters(search: string, outers: BagOuters): string[] {
  let allowed = new Array<string>();
  let queue = [search];
  let visited = new Set<string>(queue);
  while (queue.length > 0) {
    let color = queue.shift();
    let outBags = outers.get(color);
    if (outBags) {
      for (let out of outBags) {
        if (!visited.has(out)) {
          visited.add(out);
          queue.push(out);
          allowed.push(out);
        }
      }
    }
  }
  return allowed;
}

function countContained(search: string, rules: BagRules): number {
  let contained = rules.get(search);
  if (contained) {
    return contained.map(bags => {
      let [num,color] = bags;
      return num * (1 + countContained(color, rules));
    }).reduce(sum, 0);
  }
  return 0;
}

function solvePart1(lines: string[]): number {
  let rules = readRules(lines);
  let outers = invertRules(rules);
  
  let outersOfShinyGold = findOuters('shiny_gold', outers);
  return outersOfShinyGold.length;
}

function solvePart2(lines: string[]): number {
  let rules = readRules(lines);
  let containedByShinyGold = countContained('shiny_gold', rules);
  return containedByShinyGold;
}

export function run(fileData: string) {
  test(solvePart1, testCases1);
  test(solvePart2, testCases2);
  let lines = fileData.split('\n').filter(notEmpty);

  const result_1 = solvePart1(lines);
  console.log(`Part1 (Shiny-gold allowed): ${result_1}`);

  const result_2 = solvePart2(lines);
  console.log(`Part2 (Shiny-gold contains): ${result_2}`);
}
