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
  return lines.map(line => {
    let terms = line.split(' ');
    let color = readBagColor(terms);
    terms = terms.slice(4);
    if (terms[0] === 'no') {
      return [];
    }
    let contents = [];
    while (terms.length > 0) {
      contents.push(readContents(terms));
    }
    return contents;
  });
}

export function run(fileData: string) {
  let lines = fileData.split('\n');

  let rules = readRules(lines);
}
