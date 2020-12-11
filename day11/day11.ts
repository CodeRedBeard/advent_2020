import { notEmpty, countOf, countSum } from '../util';
import { TestCase, test } from '../test';

const testCases1 : TestCase<string[],number>[]= [
  [[
    'L.LL.LL.LL',
    'LLLLLLL.LL',
    'L.L.L..L..',
    'LLLL.LL.LL',
    'L.LL.LL.LL',
    'L.LLLLL.LL',
    '..L.L.....',
    'LLLLLLLLLL',
    'L.LLLLLL.L',
    'L.LLLLL.LL',
  ], 37],
];
const testCases2 : TestCase<string[],number>[]= [
  [testCases1[0][0], 26],
];

enum Cell {
  Floor,
  Empty,
  Taken,
}
function makeCell(x: string): Cell {
  if (x === 'L') {
    return Cell.Empty;
  }
  if (x === '#') {
    return Cell.Taken;
  }
  if (x === '.') {
    return Cell.Floor;
  }
  throw new Error();
}
function printCell(c: Cell): string {
  switch (c) {
    case Cell.Floor: return '.';
    case Cell.Empty: return 'L';
    case Cell.Taken: return '#';
  }
}
class Grid {
  private readonly cells: Cell[][] = [];

  public get height() { return this.cells.length; }
  public get width() { return this.cells[0].length; }

  private constructor(cells: Cell[][]) {
    this.cells = cells;
  }

  public static create(lines: string[]) {
    return new Grid(lines.map(
      line => line.split('').map(makeCell)));
  }

  public getCell(x: number, y: number): Cell {
    return this.cells[y][x];
  }

  public setCell(x: number, y: number, c: Cell) {
    this.cells[y][x] = c;
  }

  public getVisibles(xPos: number, yPos: number, maxDist: number) {
    let dirs = [
      [-1,-1],
      [ 0,-1],
      [+1,-1],
      [-1, 0],
      [+1, 0],
      [-1,+1],
      [ 0,+1],
      [+1,+1],
    ]
    let adj: Cell[] = [];
    for (const [dx,dy] of dirs) {
      for (let dist = 1; dist <= maxDist; ++dist) {
        let x = xPos + dx * dist;
        let y = yPos + dy * dist;
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
          break;
        }
        const cell = this.getCell(x,y);
        if (dist >= maxDist || cell !== Cell.Floor) {
          adj.push(cell);
          break;
        }
      }
    }
    return adj;
  }

  public numTaken(): number {
    return countSum(this.cells, 
      (line) => countOf(line, Cell.Taken));
  }

  public drawGrid() {
    for (let y = 0; y < this.height; ++y) {
      const line = this.cells[y].map(printCell).join('');
      console.log(line);
    }
  }
  
  public clone(): Grid {
    let newGrid = new Grid(this.cells.map(x => x.slice()));
    return newGrid;
  }
}

function runRules(oldGrid: Grid, maxVisible: number, maxDist: number): [Grid,number] {
  let newGrid = oldGrid.clone();
  let changed = 0;
  for (let y = 0; y < oldGrid.height; ++y) {
    for (let x = 0; x < oldGrid.width; ++x) {
      const cell = oldGrid.getCell(x,y);
      let adj = oldGrid.getVisibles(x,y,maxDist);
      const adjTaken = countOf(adj, Cell.Taken);
      if (cell === Cell.Empty) {
        if (adjTaken === 0) {
          newGrid.setCell(x,y,Cell.Taken);
          ++changed;
        }
      }
      if (cell === Cell.Taken) {
        if (adjTaken >= maxVisible) {
          newGrid.setCell(x,y,Cell.Empty);
          ++changed;
        }
      }
    }
  }
  return [newGrid, changed];
}

function solvePart1(lines: string[]) {
  let grid = Grid.create(lines);
  while (true) {
    let [newGrid,changed] = runRules(grid, 4, 1);
    //newGrid.drawGrid();
    //console.log(`Taken: ${newGrid.numTaken()}`);
    //console.log(`Changed: ${changed}`);
    if (changed === 0) {
      return newGrid.numTaken();
    }
    grid = newGrid;
  }
}

function solvePart2(lines: string[]) {
  let grid = Grid.create(lines);
  while (true) {
    let [newGrid,changed] = runRules(grid, 5, Number.POSITIVE_INFINITY);
    //newGrid.drawGrid();
    //console.log(`Taken: ${newGrid.numTaken()}`);
    //console.log(`Changed: ${changed}`);
    if (changed === 0) {
      return newGrid.numTaken();
    }
    grid = newGrid;
  }
}

export function run(fileData: string) {
  test(solvePart1, testCases1);
  test(solvePart2, testCases2);
  let lines = fileData.split('\n').filter(notEmpty);

  let result_1 = solvePart1(lines);
  console.log(`Part1: (adjacent): ${result_1}`);

  let result_2 = solvePart2(lines);
  console.log(`Part2: (visible): ${result_2}`);
}
