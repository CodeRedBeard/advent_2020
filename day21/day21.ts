import { FTestCase, testFuncs } from '../test';
import { notEmpty, sum } from '../util';

function pretty(x: object) {
  return JSON.stringify(x, undefined, ' ');
}

function getOrSet<K,V>(map: Map<K,V>, k: K, f: () => V): V {
  if (map.has(k)) {
    return map.get(k);
  }
  let v = f();
  map.set(k, v);
  return v;
}

function mapIncr(map: Map<string, number>, k: string) {
  let count = map.get(k) ?? 0;
  map.set(k, count + 1);
}

function readData(line: string): [string[],string[]] {
  let allergRegex = new RegExp(
    '^contains ([a-z ,]+)\\)$');
  let [a,b] = line.split('(', 2);
  let ingred = a.trim().split(' ');
  let allerg = b
    ? allergRegex.exec(b)[1].split(',').map(x => x.trim())
    : [];
  return [ingred,allerg];
}

function setIntersect(setA: Iterable<string>, setB: Set<string>) {
  let i = new Set<string>();
  for (let a of setA) {
    if (setB.has(a)) {
      i.add(a);
    }
  }
  return i;
}

function attempt1(lines: string[]): number {
  let data = lines.map(readData);
  let ingredCount = new Map<string, number>();
  let allAllergs = new Set<string>();
  for (let [ingred, allerg] of data) {
    for (let i of ingred) {
      mapIncr(ingredCount, i);
    }
    for (let a of allerg) {
      allAllergs.add(a);
    }
  }
  let allergSets = new Map<string, Set<string>>();
  for (let [ingred, allerg] of data) {
    for (let a of allerg) {
      let oldSet = allergSets.get(a);
      let newSet = oldSet ? setIntersect(ingred, oldSet) : new Set(ingred);
      allergSets.set(a, newSet);
    }
  }
  let allergIngreds = new Set<string>();
  for (let ingred of allergSets.values()) {
    for (let i of ingred) {
      allergIngreds.add(i);
    }
  }
  let nonAllergIngreds = Array.from(ingredCount.entries()).filter(i => !allergIngreds.has(i[0]));
  return nonAllergIngreds.map(i => i[1]).reduce(sum);
}

function findAllergens(lines: string[]) {
  let data = lines.map(readData);
  //console.log(pretty(data));
  let ingredCount = new Map<string, number>();
  let commons = new Map<string, Map<string, number>>();
  let allergCount = new Map<string, number>();
  for (let [ingred, allerg] of data) {
    for (let i of ingred) {
      mapIncr(ingredCount, i);
    }
    for (let a of allerg) {
      let aCount = allergCount.get(a) ?? 0;
      allergCount.set(a, aCount + 1);
      let aMap = getOrSet(commons, a, () => new Map<string,number>());
      for (let i of ingred) {
        mapIncr(aMap, i);
      }
    }
  }
  //for (const c of commons.entries()) {
  //  console.log(`${c[0]}: ${pretty(Array.from(c[1].entries()))}`);
  //}
  //console.log(pretty(Array.from(allergCount.entries())));
  let allergOptions = Array.from(allergCount.entries()).map(([a, aCount]): [string,string[]] => {
    let ingred = commons.get(a);
    if (!ingred) {
      return [a, []];
    }
    return [a, Array.from(ingred.entries()).filter(i => i[1] === aCount).map(i => i[0])];
  })
  //console.log(pretty(allergOptions));
  const definites = new Map<string, string>();
  while (allergOptions.length > 0) {
    let defIdx = allergOptions.findIndex(aa => aa[1].length === 1);
    if (defIdx < 0) {
      throw new Error();
    }
    let def = allergOptions[defIdx];
    let defIngred = def[1][0];
    definites.set(def[0], defIngred);
    allergOptions.splice(defIdx, 1);
    for (let opt of allergOptions) {
      let optIngreds = opt[1];
      let match = optIngreds.indexOf(defIngred);
      if (match >= 0) {
        optIngreds.splice(match, 1);
      }
    }
  }

  return {
    ingredCount: ingredCount,
    definites: definites,
  };
}

function solvePart1(lines: string[]): number {
  let { definites, ingredCount } = findAllergens(lines);
  let definitesInv = new Map<string, string>(Array.from(definites.entries()).map(([a,b]) => [b,a]));
  let disqualified = Array.from(ingredCount.entries()).filter(i => !definitesInv.has(i[0])).map(i => i[1]);
  return disqualified.reduce(sum);
}

function solvePart2(lines: string[]): string {
  let { definites } = findAllergens(lines);
  let definitesIngreds = Array.from(definites.entries()).sort((a,b) => a[0].localeCompare(b[0])).map(([a,i]) => i);
  return definitesIngreds.join(',');
}

const testCases1: FTestCase<string[],number>[] = [
  [ solvePart1,
    [ 'mxmxvkd kfcds sqjhc nhms (contains dairy, fish)',
      'trh fvjkl sbzzf mxmxvkd (contains dairy)',
      'sqjhc fvjkl (contains soy)',
      'sqjhc mxmxvkd sbzzf (contains fish)',
    ],
    5 ],
];

const testCases2: FTestCase<string[],string>[] = [
  [ solvePart2,
    testCases1[0][1],
    'mxmxvkd,sqjhc,fvjkl' ],
];

export function run(fileData: string) {
  testFuncs(testCases1);
  testFuncs(testCases2);

  let lines = fileData.split('\n').filter(notEmpty);
  console.log(`Part1: ${solvePart1(lines)}`);
  console.log(`Part2: ${solvePart2(lines)}`);
}
