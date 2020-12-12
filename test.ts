export type TestCase<T,Y> = [T,Y];
export type FTestCase<T,Y,F = (t: T) => Y> = [F,T,Y];

export function test<T, Y>(f: (t: T) => Y, cases: TestCase<T,Y>[]) {
  for (const [idx, [vIn, vOut]] of cases.entries()) {
    let v = f(vIn);
    if (vOut !== v) {
      throw new Error(
        `case [${idx}]: ${vOut} != ${v} = f(${vIn})`);
    }
  }
}

export function testFuncs<T, Y, F extends (t: T) => Y>(cases: FTestCase<T,Y,F>[]) {
  for (const [idx, [f, vIn, vOut]] of cases.entries()) {
    let v = f(vIn);
    if (vOut !== v) {
      throw new Error(
        `case [${idx}]: ${vOut} != ${v} = f(${vIn})`);
    }
  }
}
