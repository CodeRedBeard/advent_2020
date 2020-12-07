import { test, TestCase } from "../test";
import { notEmpty } from "../util";

const testCases1: Array<TestCase<string[], number>> = [
  [[
    'light red bags contain 1 bright white bag, 2 muted yellow bags.',
    'dark orange bags contain 3 bright white bags, 4 muted yellow bags.',
    'bright white bags contain 1 shiny gold bag.',
    'muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.',
    'shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.',
    'dark olive bags contain 3 faded blue bags, 4 dotted black bags.',
    'vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.',
    'faded blue bags contain no other bags.',
    'dotted black bags contain no other bags.',
  ], 4],
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

function solvePart1(lines: string[]): number {
  let rules = readRules(lines);
  let outers = invertRules(rules);
  
  let outersOfShinyGold = findOuters('shiny_gold', outers);
  return outersOfShinyGold.length;
}

export function run(fileData: string) {
  test(solvePart1, testCases1);
  let lines = fileData.split('\n').filter(notEmpty);

  const result_1 = solvePart1(lines);
  console.log(`Part1 (Shiny-gold allowed): ${result_1}`);
}
