import { FTestCase, testFuncs } from '../test';
import { first, last, mul } from '../util';

interface Cup {
  readonly val: number;
  prev: Cup | null;
  next: Cup | null;
}
type CupMap = Array<Cup>;

function initCups(init: number[], total: number): CupMap {
  let cups = new Array<Cup>();
  cups.fill(null);
  let prevCup: Cup | null = null;
  function addCup(x: number) {
    let newCup: Cup = { val: x, prev: prevCup, next: null };
    cups[x-1] = newCup;
    prevCup = newCup;
  }
  for (let x of init) {
    addCup(x);
  }
  let max = Math.max(...init);
  for (let x = max + 1; x <= total; ++x) {
    addCup(x);
  }
  cups[init[0]-1].prev = prevCup;
  for (let c of cups) {
    c.prev.next = c;
  }
  cups.sort((a,b) => a.val - b.val);
  return cups;
}

function removeCups(start: Cup, end: Cup): Cup[] {
  let prev = start.prev;
  let next = end.next;
  prev.next = next;
  next.prev = prev;
  start.prev = null;
  end.next = null;
  let removed: Cup[] = [];
  for (let x = start; x !== end; x = x.next) {
    removed.push(x);
  }
  removed.push(end);
  return removed;
}

function insertCups(after: Cup, inserts: Cup[]) {
  let next = after.next;
  after.next = inserts[0];
  after.next.prev = after;
  next.prev = last(inserts);
  next.prev.next = next;
}

function doMove(cur: number, cups: CupMap) {
  let curCup = cups[cur-1];
  let out = removeCups(curCup.next, curCup.next.next.next);
  function wrapToMax(x: number) {
    if (x < 1) {
      x = cups.length;
    }
    return x;
  }
  let dest = wrapToMax(cur - 1);
  while (out.some(x => x.val === dest)) {
    dest = wrapToMax(dest - 1);
  }
  let destCup = cups[dest-1];
  insertCups(destCup, out);
  //console.log(cups.slice(10));
}

function doMoves(numMoves: number, initSize: number) {
  return (input: string) => {
    let init = input.trim().split('').map(Number);
    let cups = initCups(init, initSize);
    let cur = first(init);
    for (let x = 0; x < numMoves; ++x) {
      doMove(cur, cups);
      cur = cups[cur-1].next.val;
    }
    return cups;
  }
}

function solvePart1(input: string) {
  let cups = doMoves(100, input.length)(input);
  let cup1 = cups[0];
  let result: number[] = [];
  for (let curCup = cup1.next; curCup && curCup !== cup1; curCup = curCup.next) {
    result.push(curCup.val);
  }
  return result.join('');
}

function solvePart2(input: string) {
  let cups = doMoves(10*1000*1000, 1*1000*1000)(input);
  let cup1 = cups[0];
  let vals = [cup1.next.val, cup1.next.next.val];
  return vals.reduce(mul);
}

const testCases1: FTestCase<string,string>[] = [
  [ solvePart1,
    '389125467',
    '67384529'],
];

const testCases2: FTestCase<string,number>[] = [
  [ solvePart2,
    '389125467',
    149245887792],
];

export function run(fileData: string) {
  testFuncs(testCases1);
  testFuncs(testCases2);

  console.log(`Part1: ${solvePart1(fileData)}`);
  console.log(`Part2: ${solvePart2(fileData)}`);
}
