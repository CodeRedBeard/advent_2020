import { FTestCase, testFuncs } from '../test';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Cell extends Vec3 {
  active: boolean;
}
type State = Map<string, Vec3>;

function posStr(v: Vec3) {
  return `${v.x}_${v.y}_${v.z}`;
}

function initState(lines: string[]) {
  let s: State = new Map();
  for (let [y, line] of lines.entries()) {
    for (let [x, ch] of line.split('').entries()) {
      if (ch !== '#') {
        continue;
      }
      let cell = { x:x, y:y, z:0 };
      let str = posStr(cell);
      s.set(str, cell);
    }
  }
  return s;
}

function stateExtents(s: State) {
  let ext: null | {
    min: Vec3,
    max: Vec3,
  } = null;
  for (let c of s.values()) {
    if (!ext) {
      ext = {
        min: {x:c.x, y:c.y, z:c.z},
        max: {x:c.x, y:c.y, z:c.z},
      };
    }
    ext.min.x = Math.min(ext.min.x, c.x);
    ext.min.y = Math.min(ext.min.y, c.y);
    ext.min.z = Math.min(ext.min.z, c.z);
    ext.max.x = Math.max(ext.max.x, c.x);
    ext.max.y = Math.max(ext.max.y, c.y);
    ext.max.z = Math.max(ext.max.z, c.z);
  }
  return ext;
}

function evalCell(c: Vec3, s: State): number {
  let neighborCount = 0;
  for (let z = c.z - 1; z <= c.z + 1; ++z) {
    for (let y = c.y - 1; y <= c.y + 1; ++y) {
      for (let x = c.x - 1; x <= c.x + 1; ++x) {
        if (x === c.x && y === c.y && z === c.z) {
          continue;
        }
        const newCell = {x:x, y:y, z:z};
        const key = posStr(newCell);
        if (s.has(key)) {
          ++neighborCount;
        }
      }
    }
  }
  return neighborCount;
}

function nextState(prev: State): State {
  let newState: State = new Map();
  let ext = stateExtents(prev);
  for (let z = ext.min.z - 1; z <= ext.max.z + 1; ++z) {
    for (let y = ext.min.y - 1; y <= ext.max.y + 1; ++y) {
      for (let x = ext.min.x - 1; x <= ext.max.x + 1; ++x) {
        const newCell = {x:x, y:y, z:z};
        const key = posStr(newCell);
        const prevActive = prev.has(key);
        const neighbors = evalCell(newCell, prev);
        if (prevActive && (neighbors === 2 || neighbors === 3)) {
          newState.set(key, newCell);
        }
        else if (!prevActive && neighbors === 3) {
          newState.set(key, newCell);
        }
      }
    }
  }
  return newState;
}

function printState(s: State) {
  let ext = stateExtents(s);
  for (let z = ext.min.z; z <= ext.max.z; ++z) {
    console.log(`\nz=${z}, y=${ext.min.y}, x=${ext.min.x}`);
    for (let y = ext.min.y; y <= ext.max.y; ++y) {
      let lineStr = '';
      for (let x = ext.min.x; x <= ext.max.x; ++x) {
        const newCell = {x:x, y:y, z:z};
        const key = posStr(newCell);
        lineStr += s.has(key) ? '#' : '.';
      }
      console.log(lineStr);
    }
  }
}

function solvePart1(lines: string[]) {
  let state = initState(lines);
  for (let it = 0; it < 6; ++it) {
    state = nextState(state);
    //console.log(`it=${it}, num=${state.size}`);
    //printState(state);
  }
  return state.size;
}

const testCases: FTestCase<string[],number>[] = [
  [ solvePart1,
    [
      '.#.',
      '..#',
      '###',
    ],
    112]
];

export function run(fileData: string) {
  testFuncs(testCases);

  let lines = fileData.split('\n');
  console.log(`Part1: ${solvePart1(lines)}`);
}
