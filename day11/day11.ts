import { notEmpty, count } from '../util';

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
class Grid {
  cells: Cell[][] = [];

  public getCell(x: number, y: number): Cell {
    return this.cells[y][x];
  }

  public setCell(x: number, y: number, c: Cell) {
    this.cells[y][x] = c;
  }

  public getAdjacents(xPos: number, yPos: number) {
    let adj: Cell[] = [];
    for (let y = yPos-1; y <= yPos+1; ++y) {
      if (y < 0 || y >= this.cells.length) {
        continue;
      }
      const cellLine = this.cells[y];
      for (let x = xPos-1; x <= xPos+1; ++x) {
        if (x < 0 || x >= cellLine.length) {
          continue;
        }
        if (x === xPos && y === yPos) {
          continue;
        }
        adj.push(cellLine[x]);
      }
    }
    return adj;
  }

  public numTaken(): number {
    return this.cells.reduce(
      (sum,line) => count(line,
        c => c === Cell.Taken),
      0);
  }

  public clone(): Grid {
    let newGrid = new Grid();
    newGrid.cells = this.cells.map(x => x.slice());
    return newGrid;
  }
}

function runRules(oldGrid: Grid): [Grid,number] {
  let newGrid = oldGrid.clone();
  let changed = 0;
  for (let [y, cellLine] of oldGrid.cells.entries()) {
    for (let [x, cell] of cellLine.entries()) {
      let adj = oldGrid.getAdjacents(x,y);
      const adjTaken = count(adj,
        a => a === Cell.Taken);
      if (cell === Cell.Empty) {
        if (adjTaken === 0) {
          newGrid.setCell(x,y,Cell.Taken);
          ++changed;
        }
      }
      if (cell === Cell.Taken) {
        if (adjTaken >= 4) {
          newGrid.setCell(x,y,Cell.Empty);
          ++changed;
        }
      }
    }
  }
  return [newGrid, changed];
}

function solvePart1(lines: string[]) {
  let grid = new Grid();
  grid.cells = lines.map(
    line => line.split('').map(makeCell));
  while (true) {
    let [newGrid,changed] = runRules(grid);
    if (changed === 0) {
      return newGrid.numTaken();
    }
    grid = newGrid;
  }
}

export function run(fileData: string) {
  let lines = fileData.split('\n').filter(notEmpty);

  let result_1 = solvePart1(lines);
  console.log(`Part1: (seats taken): ${result_1}`);
}
