import { FTestCase, testFuncs } from '../test';

type Vector = number[];
interface State {
  dimensions: number;
  cells: Map<string, Vector>;
}

function posStr(v: Vector) {
  return v.join('_');
}

function initState(dimensions: number, lines: string[]) {
  let s: State = {
    dimensions: dimensions,
    cells: new Map(),
  };
  for (let [y, line] of lines.entries()) {
    for (let [x, ch] of line.split('').entries()) {
      if (ch !== '#') {
        continue;
      }
      let cell = new Array<number>(dimensions).fill(0);
      cell[0] = x;
      cell[1] = y;
      let str = posStr(cell);
      s.cells.set(str, cell);
    }
  }
  return s;
}

interface Extents {
  min: Vector,
  max: Vector,
};
function stateExtents(s: State) {
  let ext: Extents | null = null;
  for (let c of s.cells.values()) {
    if (!ext) {
      ext = {
        min: c.slice(),
        max: c.slice(),
      };
    }
    for (let d = 0; d < s.dimensions; ++d) {
      ext.min[d] = Math.min(ext.min[d], c[d]);
      ext.max[d] = Math.max(ext.max[d], c[d]);
    }
  }
  return ext;
}

function expandExtents(ext: Extents): Extents {
  return {
    min: ext.min.map(k => k - 1),
    max: ext.max.map(k => k + 1),
  };
}

function evalExtents(s: State, ext: Extents, f: (pos: Vector) => void) {
  let evalCount = 0;
  function evalDimension(d: number, pos: Vector) {
    if (d === s.dimensions) {
      ++evalCount;
      f(pos);
    }
    else {
      for (let k = ext.min[d]; k <= ext.max[d]; ++k) {
        pos[d] = k;
        evalDimension(d + 1, pos);
      }
    }
  }
  let cellPos = ext.min.slice();
  evalDimension(0, cellPos);
}

function evalCell(c: Vector, s: State): number {
  let neighborCount = 0;
  let ext = expandExtents({min: c, max: c});
  evalExtents(s, ext, (pos) => {
    if (pos.every((v,i) => v === c[i])) {
      return;
    }
    const key = posStr(pos);
    if (s.cells.has(key)) {
      ++neighborCount;
    }
  });
  return neighborCount;
}

function nextState(prev: State): State {
  let newState: State = {
    dimensions: prev.dimensions,
    cells: new Map(),
  };
  let ext = expandExtents(stateExtents(prev));
  evalExtents(prev, ext, (pos) => {
    let newCell = pos.slice();
    const key = posStr(newCell);
    const prevActive = prev.cells.has(key);
    const neighbors = evalCell(newCell, prev);
    if (prevActive && (neighbors === 2 || neighbors === 3)) {
      newState.cells.set(key, newCell);
    }
    else if (!prevActive && neighbors === 3) {
      newState.cells.set(key, newCell);
    }
  });
  return newState;
}

/*
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
*/

function solvePart1(lines: string[]) {
  let state = initState(3, lines);
  for (let it = 0; it < 6; ++it) {
    state = nextState(state);
    //console.log(`it=${it}, num=${state.size}`);
    //printState(state);
  }
  return state.cells.size;
}

function solvePart2(lines: string[]) {
  let state = initState(4, lines);
  for (let it = 0; it < 6; ++it) {
    state = nextState(state);
    //console.log(`it=${it}, num=${state.size}`);
    //printState(state);
  }
  return state.cells.size;
}

const testCases: FTestCase<string[],number>[] = [
  [ solvePart1,
    [
      '.#.',
      '..#',
      '###',
    ],
    112],
  [ solvePart2,
    [
      '.#.',
      '..#',
      '###',
    ],
    848],
];

export function run(fileData: string) {
  testFuncs(testCases);

  let lines = fileData.split('\n');
  console.log(`Part1: ${solvePart1(lines)}`);
  console.log(`Part2: ${solvePart2(lines)}`);
}
