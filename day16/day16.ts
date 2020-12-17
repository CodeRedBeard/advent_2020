import * as fs from 'fs';
import { sum } from '../util';
import { testFuncs, FTestCase } from '../test';

interface Range {
  min: number,
  max: number;
}
function solvePart1(input: string) {
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

  let invalids: number []=[];
  for (let ticket of otherTickets) {
    for (let value of ticket) {
      let valid = false;
      for (let ranges of fields.values()) {
        for (let range of ranges) {
          if (value >= range.min && value <= range.max) {
            valid = true;
          }
        }
      }
      if (!valid) {
        invalids.push(value);
      }
    }
  }

  return invalids.reduce(sum);
}

const testCases: FTestCase<string,number>[] = [
  [ solvePart1,
    fs.readFileSync('day16/test1.txt', {encoding: 'utf8'}),
    71
  ],
//  [ solvePart2,
//    fs.readFileSync('day16/test2.txt', {encoding: 'utf8'}),
//    1
//  ],
];

export function run(fileData: string) {
  testFuncs(testCases);

  console.log(`Part1: ${solvePart1(fileData)}`);
}
