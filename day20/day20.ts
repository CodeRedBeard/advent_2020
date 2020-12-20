import { FTestCase, testFuncs } from '../test';
import { readInputFile, first, last, notEmpty, mul } from '../util';

function readTiles(input: string) {
  let tileStr = input.split('\n\n')
    .map(t => t.split('\n').filter(notEmpty));
  let idRegex = new RegExp('^Tile (\\d+):$');
  return tileStr.map(t => ({
    id: idRegex.exec(t[0])[1],
    data: t.slice(1),
  }));
}

function getEdges(tile: string[]) {
  return [
    first(tile),
    tile.map(last).join(''),
    last(tile),
    tile.map(first).join(''),
  ];
}

function solvePart1(input: string) {
  let tiles = readTiles(input);
  let edges = tiles.map(t => ({
    id: Number(t.id),
    edges: getEdges(t.data)}));
  //console.log(edges);
  let edgeMap = new Map<string,number[]>();
  function addEdge(e: string, id: number) {
    let list = edgeMap.get(e);
    if (!list) {
      list = [];
      edgeMap.set(e, list);
    }
    list.push(id);
  }
  for (let t of edges) {
    for (let e of t.edges) {
      addEdge(e, t.id);
      addEdge(Array.from(e).reverse().join(''), t.id);
    }
  }
  //console.log(edgeMap.entries());
  let singles = Array.from(edgeMap.entries())
    .filter(x => x[1].length === 1)
    .map(x => x[1][0]);
  let counts = new Map<number,number>();
  for (let x of singles) {
    let num = counts.get(x) ?? 0;
    counts.set(x, num + 1);
  }
  //console.log(counts);
  let corners = Array.from(counts.entries())
    .filter(x => x[1] === 4)
    .map(x => x[0]);
  if (corners.length != 4) {
    throw new Error();
  }
  return corners.reduce(mul);
}

const testCases: FTestCase<string,number>[] = [
  [ solvePart1,
    readInputFile('day20/test1.txt'),
    20899048083289 ],
];

export function run(fileData: string) {
  testFuncs(testCases);

  console.log(`Part1: ${solvePart1(fileData)}`);
}
