function getGrid(fileData: string) {
  let lines = fileData.split('\n');
  return lines.map(line =>
  	Array.from(line).map(c => c === '#'));
}

function countTrees(grid: boolean[][], sx: number, sy: number) {
  let trees = 0;
  for (let y = 0, x=0; y < grid.length;) {
  	let line = grid[y];
  	let lx = x % line.length;
  	if (line[lx]) {
  	  ++trees;
  	}
  	x += sx;
  	y += sy;
  }
  return trees;
}

export function run(file_data: string) {
  let grid = getGrid(file_data);
  let trees_1 = countTrees(grid, 3, 1);
  console.log(`Trees 1: ${trees_1}`);

  let args_2 = [
  	[1,1],
  	[3,1],
  	[5,1],
  	[7,1],
  	[1,2],
  ];
  let trees_2 = args_2.map(c => countTrees(grid, c[0], c[1]));
  let trees_prod_2 = trees_2.reduce((p,c) => p * c); 
  console.log(`Trees 2: ${trees_prod_2} (${trees_2})`);
}
