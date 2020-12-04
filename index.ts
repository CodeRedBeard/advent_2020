import * as fs from 'fs';

const DAY_STR = process.argv[2] ?? '1';
const DAY_NUM = Number(DAY_STR);

console.log(`Day ${DAY_STR}`);
let file_data = fs.readFileSync(
  `./day${DAY_NUM}/input.txt`,
  {encoding:'utf8'});
let day_mod = `./day${DAY_NUM}/day${DAY_NUM}`;
import(day_mod).then(
  (DayModule: any) => {
    DayModule.run(file_data);
  });

