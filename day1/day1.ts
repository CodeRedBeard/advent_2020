import * as fs from 'fs';

function match2(numbers: number[]) {
  for (const a of numbers) {
    for (const b of numbers) {
      if (a !== b && (a + b) === 2020) {
        console.log(`${a} + ${b} = 2020`);
        console.log(`${a} * ${b} = ${a * b}`);
        return a * b;
      }
    }
  }
  return -1;
}

function match3(numbers: number[]) {
  for (const a of numbers) {
    for (const b of numbers) {
      for (const c of numbers) {
        if ((a + b + c) === 2020) {
          console.log(`${a} + ${b} + ${c} = 2020`);
          console.log(`${a} * ${b} * ${c} = ${a * b * c}`);
          return a * b * c;
        }
      }
    }
  }
  return -1;
}

export function day1() {
  let data = fs.readFileSync('./day1/data.txt',
    {encoding: 'utf8'});
  let numbers = data.split('\n').map(Number);
  let allSum = numbers.reduce((p,c) => p + c);
  console.log(`Sum: ${allSum}`);

  match2(numbers);
  match3(numbers);
}
