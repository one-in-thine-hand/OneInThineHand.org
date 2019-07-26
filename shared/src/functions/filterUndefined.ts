export function filterUndefined<T>(array: (T | undefined)[]): T[] {
  return array.filter(
    (a): boolean => {
      return a !== undefined;
    },
  ) as T[];
}

export function findByAttribute<T, K extends keyof T, T3>(
  arr: T[],
  attr: K,
  value: T3,
): T | undefined {
  return arr.find(
    (a): boolean => {
      return ((a[attr] as unknown) as T3 | undefined) === value;
    },
  );
}

export function pushToArray<T, K extends keyof T, T3>(
  arr: T,
  attr: K,
  value: T3,
): void {
  if (arr[attr] === undefined) {
    (arr[attr] as unknown) = [];
  }
  ((arr[attr] as unknown) as T3[]).push(value);
}
