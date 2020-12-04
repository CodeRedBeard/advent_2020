export function notEmpty(x: string): boolean {
    return (x.length > 0) && (x !== '\r');
}

export function count<T>(arr: T[], f: (x: T) => boolean) {
    return arr.reduce((p, c) => p + (f(c) ? 1 : 0), 0);
}
