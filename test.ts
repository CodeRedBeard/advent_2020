export type TestCase<T,Y> = [T,Y];

export function test<T, Y>(f: (t: T) => Y, cases: TestCase<T,Y>[]) {
  for (const [idx, [vIn, vOut]] of cases.entries()) {
    let v = f(vIn);
    if (vOut !== v) {
      throw new Error(
        `case [${idx}]: ${vOut} != ${v} = f(${vIn})`);
    }
  }
}
