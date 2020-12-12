import { FTestCase, testFuncs } from "../test";

type Instruc = [string,number];
function parseInstruc(lines: string[]) {
  let instr: Instruc[] = lines.map(
    line => [line[0], Number(line.slice(1))]);
  return instr;
}

function solvePart1(lines: string[]) {
  let instr = parseInstruc(lines);
  let pos = {x:0, y:0, h: 270};
  for (const i of instr) {
    let {x,y,h} = pos;
    const val = i[1];
    switch (i[0]) {
      case 'L': h += val; break;
      case 'R': h -= val; break;
      case 'F':
        if (h === 0) { y += val; }
        else if (h === 90) { x -= val; }
        else if (h === 180) { y -= val; }
        else if (h === 270) { x += val; }
        else { throw new Error(); }
        break;
      case 'N': y += val; break;
      case 'S': y -= val; break;
      case 'E': x += val; break;
      case 'W': x -= val; break;
    }
    while (h < 0) {
      h += 360;
    }
    while (h >= 360) {
      h -= 360;
    }
    pos = {x:x, y:y, h:h};
  }

  return Math.abs(pos.x) + Math.abs(pos.y);
}

function solvePart2(lines: string[]) {
  let instr = parseInstruc(lines);
  let pos = {x:0, y:0};
  let wp = {x:10, y:1};
  for (const i of instr) {
    let val = i[1];
    switch (i[0]) {
      case 'L': 
        for (let angle = val; angle > 0; angle -= 90) {
          let {x,y} = wp;
          wp.x = -y;
          wp.y = x;
        }
        break;
      case 'R':
        for (let angle = val; angle > 0; angle -= 90) {
          let {x,y} = wp;
          wp.x = y;
          wp.y = -x;
        }
        break;
      case 'F':
        pos.x += wp.x * val;
        pos.y += wp.y * val;
        break;
      case 'N': wp.y += val; break;
      case 'S': wp.y -= val; break;
      case 'E': wp.x += val; break;
      case 'W': wp.x -= val; break;
    }
  }

  return Math.abs(pos.x) + Math.abs(pos.y);
}

const testInput1 = [
  'F10',
  'N3',
  'F7',
  'R90',
  'F11',
];
const testCases: FTestCase<string[], number>[] = [
  [solvePart1, testInput1, 25],
  [solvePart2, testInput1, 286],
];

export function run(fileData: string) {
  testFuncs(testCases);

  let lines = fileData.split('\n')

  console.log(`Part1: ${solvePart1(lines)}`);
  console.log(`Part2: ${solvePart2(lines)}`);
}
