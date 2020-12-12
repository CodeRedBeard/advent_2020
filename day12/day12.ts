type Instruc = [string,number];
function parseInstruc(lines: string[]) {
  let instr: Instruc[] = lines.map(
    line => [line[0], Number(line.slice(1))]);
  return instr;
}

function solvePart1(lines: string[]) {
  let instr = parseInstruc(lines);
  let pos = {x:0, y:0, h: 270};
  for (const i of instr) {
    let {x,y,h} = pos;
    const val = i[1];
    switch (i[0]) {
      case 'L': h += val; break;
      case 'R': h -= val; break;
      case 'F':
        if (h === 0) { y += val; }
        else if (h === 90) { x -= val; }
        else if (h === 180) { y -= val; }
        else if (h === 270) { x += val; }
        else { throw new Error(); }
        break;
      case 'N': y += val; break;
      case 'S': y -= val; break;
      case 'E': x += val; break;
      case 'W': x -= val; break;
    }
    while (h < 0) {
      h += 360;
    }
    while (h >= 360) {
      h -= 360;
    }
    pos = {x:x, y:y, h:h};
  }

  return Math.abs(pos.x) + Math.abs(pos.y);
}

export function run(fileData: string) {
  let lines = fileData.split('\n')

  console.log(`Part1: ${solvePart1(lines)}`);
}
