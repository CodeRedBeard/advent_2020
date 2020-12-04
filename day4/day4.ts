function parsePassports(fileData: string) {
  function eatOne(lines: string[]) {
    let all = new Map<string, string>();
    while (true) {
      let line = lines.pop();
      if (!line) {
        break;
      }
      let items = line.trim().split(' ');
      for (const i of items) {
      	let [k,v] = i.split(':');
      	all.set(k, v);
      }
    }
    return all;
  }

  let fileLines = fileData.split('\n').filter(x => x.length > 0);
  let passes = [];
  while (true) {
  	let passport = eatOne(fileLines);
  	if (passport.size === 0) {
  		break;
  	}
  	passes.push(passport);
  }
  return passes;
}

export function run(fileData: string) {
  const passes = parsePassports(fileData);
}
