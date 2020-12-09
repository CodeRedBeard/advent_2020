function isValidValue(val: number, prev: number[]) {
  for (const a of prev) {
    for (const b of prev) {
      if (a === b) {
        continue;
      }
      if (val === a + b) {
        return true;
      }
    }
  }
  return false;
}

function solvePart1(lines: number[]) {
  const window = 25;
  for (let x = window; x < lines.length; ++x) {
    const prev = lines.slice(x - window, x);
    const val = lines[x];
    if (!isValidValue(val, prev)) {
      return val;
    }
  }
  return undefined;
}

function solvePart2(lines: number[]) {
  const badVal = solvePart1(lines);
  for (let start = 0; start < lines.length; ++start){
    let sum = 0;
    let x = start;
    for (x = start; sum < badVal; ++x) {
      sum += lines[x];
    }
    if (sum === badVal) {
      let range = lines.slice(start, x);
      let min = Math.min(...range);
      let max = Math.max(...range);
      return min + max;
    }
  }
}

export function run(fileData: string) {
  let lines = fileData.split('\n').map(Number);

  let result_1 = solvePart1(lines);
  console.log(`Part1: ${result_1}`);

  let result_2 = solvePart2(lines);
  console.log(`Part2: ${result_2}`);
}
