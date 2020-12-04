import * as Day1 from './day1/day1';
import * as Day2 from './day2/day2';

const DAY_NUM: number = 2;

console.log(`Day ${DAY_NUM}`);
switch (DAY_NUM) {
    case 1:
        Day1.day1();
        break;
    case 2:
        Day2.run();
        break;
}
