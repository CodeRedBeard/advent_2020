function count<T>(arr: T[], f: (x:T) => boolean) {
  return arr.reduce((p, c) => p + (f(c)?1:0), 0);
}

type Passport = Map<string, string>;

function parsePassports(fileData: string) {
  function eatOne(lines: string[]) {
    let all = new Map<string, string>();
    while (true) {
      let line = lines.pop();
      if (!line) {
        break;
      }
      line = line.trim();
      if (line.length === 0) {
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

function validPassport(pass: Passport): boolean {
  const checkFields = [
    ['byr', (x: string) => x.length === 4 && Number(x) >= 1920 && Number(x) <= 2002],
    ['iyr', (x: string) => x.length === 4 && Number(x) >= 2010 && Number(x) <= 2020],
    ['eyr', (x: string) => x.length === 4 && Number(x) >= 2020 && Number(x) <= 2030],
    ['hgt', (x: string) => false],
    ['hcl', (x: string) => x.match(new RegExp('\#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]'))],
    ['ecl', (x: string) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(x)],
    ['pid', (x: string) => x.length === 9 && Array.from(x).every(c => c.match()))],
    //'cid',
  ];
  for (const field of checkFields) {
    if (!pass.has(field[0])) {
      return false;
    }
  }
  return true;
}

export function run(fileData: string) {
  const passes = parsePassports(fileData);
  const num_valid = count(passes, validPassport);
  console.log(`Valid: ${num_valid}`);
}
