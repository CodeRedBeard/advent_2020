function readPass(line: string) {
  let row = 0;
  let col = 0;
  for (let x = 0; x < 7; ++x) {
    if (line[6 - x] === 'B') {
      row += 1 << x;
    }
  }
  for (let x = 0; x < 3; ++x) {
    if (line[7 + 2 - x] === 'R') {
      col += 1 << x;
    }
  }
  return [row, col];
}

function seatId(pass: [number, number]) {
  return pass[0] * 8 + pass[1];
}

function findMissing(ids: number[]) {
  let allVals = new Array(1024);
  for (let id of ids) {
    allVals[id] = true;
  }
  for (let x = 1; x < allVals.length - 1; ++x) {
    let val = allVals[x];
    if (!val && allVals[x-1] && allVals[x+1]) {
      return x;
    }
  }
  return Number.NaN;
}

export function run(fileData: string) {
  let lines = fileData.split('\n');
  let passes = lines.map(readPass);
  let ids = passes.map(seatId);
  console.log(`firstID: ${ids[0]} ${passes[0]}`);
  let biggest = Math.max(...ids);
  console.log(`BigID: ${biggest}`);
  let missing = findMissing(ids);
  console.log(`MissingID: ${missing}`);
}
