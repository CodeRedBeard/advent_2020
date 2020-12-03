import * as fs from 'fs';

export function day1() {
  let data = fs.readFileSync('./day1/data.txt',
    {encoding: 'utf8'});
  let numbers = data.split('\n').map(Number);
  let sum = numbers.reduce((p,c) => p + c);
  console.log(`Sum: ${sum}`);
}

