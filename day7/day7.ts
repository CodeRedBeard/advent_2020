type BagContent = [number,string];
function readRules(lines: string[]) {
  function readBagColor(arr: string[]) {
    return `${arr[0]}_${arr[1]}`;
  }
  function readContents(x: string[]) {
    let count = Number(x.shift());
    let color = readBagColor(x);
    x.shift();
    return [count, color];
  }
  return new Map<string, BagContent[]>(lines.map(line => {
    let terms = line.split(' ');
    let color = readBagColor(terms);
    terms = terms.slice(4);
    if (terms[0] === 'no') {
      return [];
    }
    let contents: BagContent[] = [];
    while (terms.length > 0) {
      contents.push(readContents(terms));
    }
    return [color, contents];
  });
}

function invertRules(rules: Map<string,[number,string][]>) {
  let outers = new Map<string, string[]>();
  for (let [k, v] of rules.entries()) {
    for (let vx of v) {
      let color = vx[1];
      let o = outers.get(color) ?? [];
      o.push(k);
      outers.set(color, o);
    }
  }
}

function countOuters(search: string, outers: Map<string,string>) {
  let num = 0;
  let q = [search];
  let v = new Set<string>();
  while (q.length > 0) {
    let x = q.pop();
    v.add(x);
    let o = outers.get(x);
    for (let i of o) {
      if (!v.has(i)) {
        q.push(i);
        ++num;
      }
    }
  }
  return num;
}

export function run(fileData: string) {
  let lines = fileData.split('\n');

  let rules = readRules(lines);
  let outers = invertRules(rules);
  
}
