
function count<T>(arr: T[], f: (x:T) => boolean) {
  return arr.reduce((p, c) => p + (f(c)?1:0), 0);
}

function check_pass(mode:1|2) {
  return (line: string): boolean => {
  let [policy,pass] = line.split(':');
  let [pol_num,pol_char] = policy.split(' ');
  let [min,max] = pol_num.split('-').map(Number);
  let pass_arr = Array.from(pass.trim());
  let check_char = (c: string) => c === pol_char;
  
  if (mode === 1) {
    let num_found = count(pass_arr, check_char);
    return (num_found >= min) && (num_found <= max);
  }
  else if (mode === 2) {
    let c1 = pass_arr[min-1];
    let c2 = pass_arr[max-1];
    let num_match = count([c1,c2], check_char);
    return num_match === 1;
  }
  };
}

export function run(input: string) {
  let lines = input.split('\n').filter(x => x.length > 0);
  let checked_1 = lines.map(check_pass(1));
  let num_good_1 = count(checked_1, x => x);
  console.log(`Good 1: ${num_good_1}`);

  let checked_2 = lines.map(check_pass(2));
  let num_good_2 = count(checked_2, x => x);
  console.log(`Good 2: ${num_good_2}`);
}
