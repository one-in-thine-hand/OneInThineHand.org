import PQueue from 'p-queue';
import FastGlob from 'fast-glob';
import { readFile } from 'fs-extra';
import { JSDOM } from 'jsdom';
const pQueue = new PQueue({ concurrency: 10 });
async function main(): Promise<void> {
  const fileNames = await FastGlob('test_breaks/**/**');
  // console.log(fileNames);
  await pQueue.add(
    (): void => {
      fileNames.map(
        async (fileName): Promise<void> => {
          const file = await readFile(fileName);
          const document = new JSDOM(file).window.document;
          console.log(document);
        },
      );
    },
  );
}

main();
