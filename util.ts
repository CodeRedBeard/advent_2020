import * as fs from 'fs';

export function readInputFile(name: string) {
  let file_data = fs.readFileSync(
    name,
    { encoding: 'utf8' })
    .replace(/\r/g, '');
  return file_data;
}

export function notEmpty(x: string): boolean {
    return (x.length > 0) && (x !== '\r');
}

export function count<T>(arr: T[], f: (x: T) => boolean) {
    return arr.reduce((p, c) => p + (f(c) ? 1 : 0), 0);
}

export function countSum<T>(arr: T[], f: (x: T) => number) {
    return arr.reduce((p, c) => p + f(c), 0);
}

export function countOf<T>(arr: T[], val: T) {
    return arr.reduce((p, c) => p + ((c === val) ? 1 : 0), 0);
}

export function sum(a: number, b: number): number {
    return a + b;
}

export function mul(a: number, b: number): number {
    return a * b;
}

export function first<T>(x: Iterable<T>) {
  for (let k of x) {
    return k;
  }
}

export function last<T>(x: Iterable<T>) {
  let arr = Array.from(x);
  return arr[arr.length - 1];
}

type Narrowable = string | number | boolean | symbol | object | {} | void | null | undefined;
export const tuple = <T extends Narrowable[]>(...args: T) => args;
