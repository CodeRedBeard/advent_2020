import * as fs from 'fs';

function findAllDays(): number[] {
  let days = new Array<number>();
  const subdirs = fs.readdirSync('.', { withFileTypes: true });
  for (const dir of subdirs) {
    if (dir.isDirectory()) {
      const dayRegEx = new RegExp('^day([0-9]+)$');
      const matches = dayRegEx.exec(dir.name);
      if (matches) {
        const dayVal = matches[1];
        const dayNum = parseInt(dayVal, 10);
        if (!isNaN(dayNum)) {
          days.push(dayNum);
        }
      }
    }
  }
  days.sort((a,b) => a - b);
  return days;
}

function findLatestDay(): number {
  const days = findAllDays();
  if (days.length === 0) {
    return Number.NaN;
  }
  return days[days.length - 1];
}

async function runDay(dayNum: number) {
  console.log(`Day ${dayNum}`);
  let file_data = fs.readFileSync(
    `./day${dayNum}/input.txt`,
    { encoding: 'utf8' });
  let day_mod = `./day${dayNum}/day${dayNum}`;
  const DayModule = await import(day_mod);
  await Promise.resolve(DayModule.run(file_data));
}

async function runAllDays() {
  const days = findAllDays();
  for (const dayNum of days) {
    await runDay(dayNum);
  }
}

async function main() {
  try {
    const DAY_STR = process.argv[2];
    if (DAY_STR === 'all') {
      await runAllDays();
    }
    else {
      const dayNum = DAY_STR ? Number(DAY_STR) : findLatestDay();
      await runDay(dayNum);
    }
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
