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

export function run(fileData: string) {
  let lines = fileData.split('\n').map(Number);

  let result_1 = solvePart1(lines);
  console.log(`Part1: ${result_1}`);
}
