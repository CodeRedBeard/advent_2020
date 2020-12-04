function count<T>(arr: T[], f: (x:T) => boolean) {
  return arr.reduce((p, c) => p + (f(c)?1:0), 0);
}

function notEmpty(x: string): boolean {
  return (x.length > 0);
}

type Passport = Map<string, string>;
function parsePassports(fileData: string) {
  function eatOne(lines: string[]): Passport {
    let all = new Map<string, string>();
    while (true) {
      let line = lines.shift();
      if (!line) {
        break;
      }
      line = line.trim();
      if (line.length === 0) {
        break;
      }
      let items = line.split(' ').filter(notEmpty);
      for (const i of items) {
        let [k,v] = i.split(':');
        all.set(k, v);
      }
    }
    return all;
  }

  let fileLines = fileData.split('\n');
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
  const hclRegEx = new RegExp('[#][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]');
  const digitRegEx = new RegExp('[0-9]');
  const eyes =['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
  function checkNum(val: string, len: number, min: number, max: number) {
  	return val.length === len
  	  && Number(val) >= min
  	  && Number(val) <= max;
  }
  type Validator = [string, (x:string)=>boolean];
  const checkFields: Validator[] = [
    ['byr', (x: string) => checkNum(x, 4, 1920, 2002)],
    ['iyr', (x: string) => checkNum(x, 4, 2010, 2020)],
    ['eyr', (x: string) => checkNum(x, 4, 2020, 2030)],
    ['hgt', (x: string) => {
    	let suffix = x.substring(x.length - 2);
    	let num = x.substring(0, x.length - 2);
    	return (suffix === 'in' && checkNum(num, 2, 59, 76))
    	 || (suffix === 'cm' && checkNum(num, 3, 150, 193));
    }],
    ['hcl', (x: string) => hclRegEx.test(x)],
    ['ecl', (x: string) => eyes.includes(x)],
    ['pid', (x: string) => 
      x.length === 9 
      && Array.from(x).every(c => digitRegEx.test(x))],
    //'cid',
  ];
  for (const field of checkFields) {
    let passField = pass.get(field[0])
    if (passField === undefined) {
      return false;
    }
    let func = field[1];
    if (!func(passField)) {
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
