import { FTestCase, testFuncs } from '../test';
import { readInputFile } from '../util';

enum Dir {
  e, se, sw, w, nw, ne,
}

interface Pos {
  q: number;
  r: number;
}

interface State {
  pos: Pos;
  flipped: Map<string,Pos>;
}

function posStr(pos: Pos) {
  return `${pos.q}_${pos.r}`;
}

function readLines(input: string) {
  let lines = input.trim().split('\n');
  return lines.map(line => {
    let dirs = new Array<Dir>();
    let chars = Array.from(line);
    while (chars.length > 0) {
      let ch = chars.shift();
      let dir: Dir;
      switch (ch) {
        default: throw new Error();
        case 'e': dir = Dir.e; break;
        case 'w': dir = Dir.w; break;
        case 's': 
          ch = chars.shift();
          if (ch === 'e') {
            dir = Dir.se;
          }
          else if (ch === 'w') {
            dir = Dir.sw;
          }
          else {
            throw new Error();
          }
          break;
        case 'n':
          ch = chars.shift();
          if (ch === 'e') {
            dir = Dir.ne;
          }
          else if (ch === 'w') {
            dir = Dir.nw;
          }
          else {
            throw new Error();
          }
          break;
      }
      dirs.push(dir);
    }
    return dirs;
  });
}

function walkTiles(dirs: Dir[], state: State) {
  for (let dir of dirs) {
    switch (dir) {
      case Dir.e: state.pos.q += 1; break;
      case Dir.w: state.pos.q -= 1; break;
      case Dir.ne:
        state.pos.q += 1;
        state.pos.r += 1;
        break;
      case Dir.se:
        state.pos.r -= 1;
        break;
      case Dir.nw:
        state.pos.r += 1;
        break;
      case Dir.sw:
        state.pos.q -= 1;
        state.pos.r -= 1;
        break;
      default: throw new Error();
    }
  }
}

function flipTile(state: State) {
  let str = posStr(state.pos);
  if (state.flipped.has(str)) {
    state.flipped.delete(str);
  }
  else {
    state.flipped.set(str,
      Object.assign({}, state.pos));
  } 
}

function solvePart1(input: string): number {
  let dirs = readLines(input);
  let state: State = {
    pos: { q:0, r:0},
    flipped: new Map(),
  };
  for (let line of dirs) {
    //console.log(line);
    state.pos = { q:0, r:0};
    walkTiles(line, state);
    flipTile(state);
  }
  //console.log(state.flipped.keys());
  return state.flipped.size;
}

const testCases: FTestCase<string,number>[] = [
  [ solvePart1, 'nwwswee', 1],
  [ solvePart1,
    readInputFile('day24/test1.txt'),
    10],
];

export function run(fileData: string) {
  testFuncs(testCases);

  console.log(`Part1: ${solvePart1(fileData)}`);
}
