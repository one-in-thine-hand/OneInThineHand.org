export function getRanges(array: number[]): [number, number][] {
  const ranges: [number, number][] = [];
  let rstart: number, rend: number;
  for (let i = 0; i < array.length; i++) {
    rstart = array[i];
    rend = rstart;
    while (array[i + 1] - array[i] === 1) {
      rend = array[i + 1]; // increment the index if the numbers sequential
      i++;
    }
    ranges.push(rstart === rend ? [rstart, rstart] : [rstart, rend]);
  }
  return ranges;
}
