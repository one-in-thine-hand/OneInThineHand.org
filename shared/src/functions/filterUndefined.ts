export function filterUndefined<T>(array: (T | undefined)[]): T[] {
  return array.filter(
    (a): boolean => {
      return a !== undefined;
    },
  ) as T[];
}
