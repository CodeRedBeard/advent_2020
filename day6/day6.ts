function readGroups(lines: string[]) {
  let group: null | [Set<string>,Set<string>] = null;
  const groups = [];
  for (const line of lines.map(s => s.trim())) {
    if (line.length === 0) {
      group = null;
    }
    else {
      let letters = new Set(line.split(''));
      if (!group) {
        group = [
          new Set<string>(),
          new Set<string>(letters)];
        groups.push(group);
      }
      for (const x of letters) {
        group[0].add(x);
      }
      for (const y of group[1]) {
        if (!letters.has(y)) {
          group[1].delete(y);
        }
      }
    }
  }
  return groups;
}

export function run(fileData: string) {
  let lines = fileData.split('\n');
  let groups = readGroups(lines);
  let sum_1 = 0;
  let sum_2 = 0;
  for (const g of groups) {
    sum_1 += g[0].size;
    sum_2 += g[1].size;
  }
  console.log(`Groups: ${groups.length}`);
  console.log(`Sum 1: ${sum_1}`);
  console.log(`Sum 2: ${sum_2}`);
}
