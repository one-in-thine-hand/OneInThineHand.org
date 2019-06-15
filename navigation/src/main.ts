// import { readFile } from 'fs-extra';
import FastGlob from 'fast-glob';
import { normalize } from 'path';
export class NavigationItem {
  public navItem: NavigationItem[] | undefined;
  public href: string | undefined;
  public text: string;
}

async function main(): Promise<void> {
  const fileNames = await FastGlob(normalize(`./manifests/**/**`));
  console.log(fileNames);
}

main();
