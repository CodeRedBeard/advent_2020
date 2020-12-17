import * as fs from 'fs';
import { sum, countOf } from '../util';
import { testFuncs, FTestCase } from '../test';

interface Range {
  min: number,
  max: number;
}
function inRange(x: number, ranges: Range[]) {
  for (let r of ranges) {
    if (x >= r.min && x <= r.max) {
      return true;
    }
  }
  return false;
}

function parseData(input: string) {
  let inputs = input.split('\n\n')
    .map(x => x.split('\n'));
  let fields = new Map<string, Range[]>();
  for (let field of inputs[0]) {
    let [name, rest] = field.split(':')
      .map(x => x.trim());
    let ranges = rest.split(' or ').map(range => {
      let [min, max] = range.split('-').map(Number);
      return { min:min, max:max };
    });
    fields.set(name, ranges);
  }

  let myTicket = inputs[1][1].split(',').map(Number);
  let otherTickets = inputs[2].slice(1)
    .map(x => x.split(',').map(Number));

  let invalids: [number,number][]=[];
  for (let [tickIdx,ticket] of otherTickets.entries()) {
    for (let value of ticket) {
      let valid = false;
      for (let ranges of fields.values()) {
        if (inRange(value, ranges)) {
          valid = true;
          break;
        }
      }
      if (!valid) {
        invalids.push([tickIdx,value]);
      }
    }
  }

  return {
    fields: fields,
    invalids: invalids,
    myTicket: myTicket,
    otherTickets: otherTickets,
    validTickets: otherTickets.filter(
      (x, idx) => !invalids.some(i => idx === i[0])),
  }
}

type TicketData = ReturnType<typeof parseData>;
function solveFields(data: TicketData) {
  let fields = Array.from(data.fields.values());
  let namedFields = Array.from(data.fields.entries());
  let possibles = fields.map(
    x => new Array(fields.length).fill(true));
  for (let ticket of data.validTickets) {
    for (let [vidx,val] of ticket.entries()) {
      for (let [fidx,ranges] of fields.entries()) {
        if (!inRange(val,ranges)) {
          possibles[vidx][fidx] = false;
        }
      }
    }
  }
  let mapped = new Map<number,number>();
  for (let it = 0; it < fields.length; ++it) {
    //console.log(possibles);
    let definiteIdx = possibles.findIndex(
      p => 1 === countOf(p, true));
    if (definiteIdx < 0) {
      throw new Error();
    }
    let which = possibles[definiteIdx].indexOf(true);
    mapped.set(definiteIdx, which);
    possibles[definiteIdx].fill(false);
    for (let p of possibles) {
      p[which] = false;
    }
  }
  let solvedFields: [number,string][] 
    = Array.from(mapped.entries())
    .map(m => [m[0], namedFields[m[1]][0]]);
  console.log(solvedFields);
  return solvedFields;
}

function solvePart1(input: string) {
  let { invalids } = parseData(input);
  return invalids.map(x => x[1]).reduce(sum);
}

function solvePart2(input: string) {
  let data = parseData(input);
  let solved = solveFields(data);
  let departures = solved.filter(
    x => x[1].startsWith('departure'));
  return departures
    .map(x => x[0])
    .map(x => data.myTicket[x])
    .reduce((p,c) => p * c);
}

const testCases: FTestCase<string,number>[] = [
  [ solvePart1,
    fs.readFileSync('day16/test1.txt', {encoding: 'utf8'}),
    71
  ],
  [ solvePart2,
    fs.readFileSync('day16/test2.txt', {encoding: 'utf8'}),
    143
  ],
];

export function run(fileData: string) {
  testFuncs(testCases);

  console.log(`Part1: ${solvePart1(fileData)}`);
  console.log(`Part2: ${solvePart2(fileData)}`);
}
