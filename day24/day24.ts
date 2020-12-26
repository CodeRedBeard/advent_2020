import { FTestCase, testFuncs } from '../test';
import { readInputFile, count } from '../util';

enum Dir {
  e, se, sw, w, nw, ne,
}
interface Pos {
  q: number;
  r: number;
}
type FloorTiles = Map<string,Pos>;
interface State {
  pos: Pos;
  flipped: FloorTiles;
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

function getInitialState(input: string): FloorTiles {
  let dirs = readLines(input);
  let state: State = {
    pos: { q:0, r:0 },
    flipped: new Map(),
  };
  for (let line of dirs) {
    //console.log(line);
    state.pos = { q:0, r:0 };
    walkTiles(line, state);
    flipTile(state);
  }
  return state.flipped;
}

function nearbyPos(pos: Pos): Pos[] {
  return [
    {q:pos.q+1, r:pos.r+0},
    {q:pos.q-1, r:pos.r+0},
    {q:pos.q+1, r:pos.r+1},
    {q:pos.q+0, r:pos.r-1},
    {q:pos.q-1, r:pos.r-1},
    {q:pos.q+0, r:pos.r+1},
  ];
}

function countNearby(pos: Pos, state: FloorTiles) {
  let near = nearbyPos(pos);
  return count(near, (x) => state.has(posStr(x)));
}

function runUpdates(days: number, state: FloorTiles) {
  let oldState = state;
  let newState: FloorTiles;
  for (let n = 0; n < days; ++n) {
    newState = new Map();
    let evalPos: FloorTiles = new Map(oldState.entries())
    for (let pos of oldState.values()) {
      for (let near of nearbyPos(pos)) {
        evalPos.set(posStr(near), near);
      }
    }
    for (let p of evalPos.values()) {
      let curSet = oldState.has(posStr(p));
      let adjSet = countNearby(p, oldState);
      if (curSet) {
        if (adjSet >= 1 && adjSet <= 2) {
          newState.set(posStr(p), p);
        }
      }
      else {
        if (adjSet === 2) {
          newState.set(posStr(p), p);
        }
      }
    }
    oldState = newState;
  }
  return newState;
}

function solvePart1(input: string): number {
  let flipped = getInitialState(input);
  //console.log(flipped.keys());
  return flipped.size;
}

function solvePart2(input: string): number {
  let tiles = getInitialState(input);
  tiles = runUpdates(100, tiles);
  return tiles.size;
}

const testCases: FTestCase<string,number>[] = [
  [ solvePart1, 'nwwswee', 1],
  [ solvePart1,
    readInputFile('day24/test1.txt'),
    10],
  [ solvePart2,
    readInputFile('day24/test1.txt'),
    2208],
];

export function run(fileData: string) {
  testFuncs(testCases);

  console.log(`Part1: ${solvePart1(fileData)}`);
  console.log(`Part2: ${solvePart2(fileData)}`);
}
