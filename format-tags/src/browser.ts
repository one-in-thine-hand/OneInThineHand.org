// import { range } from 'lodash';
// // import { range } from 'lodash';

// let verses: LDSSourceVerse[] | undefined;
// async function loadNotes(): Promise<void> {
//   console.log('Placeholder');
// }

// function generateVerseMarkdown(verse: LDSSourceVerse): string {
//   switch (verse.nodeName) {
//     case NodeName.h1: {
//       return '#';
//     }
//     case NodeName.h2: {
//       return '##';
//     }
//     case NodeName.h3: {
//       return '###';
//     }
//     case NodeName.h4: {
//       return '####';
//     }
//     case NodeName.h5: {
//       return '######';
//     }
//     case NodeName.h6: {
//       return '#######';
//     }
//   }

//   return '';
// }

// function expandFormatTagOffsets(
//   offsets: {
//     compressedOffsets: [number, number][];
//     offsets: number[] | undefined;
//   }[]
// ): void {
//   offsets.map(
//     (offset): void => {
//       if (offset.compressedOffsets) {
//         offset.compressedOffsets.map(
//           (compressedOffset): void => {
//             if (!offset.offsets) {
//               offset.offsets = [];

//               offset.offsets = offset.offsets.concat(
//                 range(compressedOffset[0], compressedOffset[1])
//               );
//             }
//           }
//         );
//       }
//     }
//   );
// }
// 7405;

// async function renderVerses(verses: LDSSourceVerse[]): Promise<void> {
//   verses.map(
//     (verse): void => {
//       const verseMarkDown = generateVerseMarkdown(verse);
//       expandFormatTagOffsets(verse.formatGroups);
//       if (verse.formatTags) {
//         expandFormatTagOffsets(verse.formatTags);
//       }
//       verse.formatGroups.map(
//         (formatGroup): void => {
//           const unmergedFormatTags: F[] = [];
//           if (formatGroup.offsets) {
//             formatGroup.offsets.map(
//               (offset): void => {
//                 if (verse.formatTags) {
//                   const formatTags = verse.formatTags.filter(
//                     (f): boolean => {
//                       return f.offsets !== undefined && f.offsets.includes(offset);
//                     }
//                   );
//                   const f = new FormatTagLDSSource();
//                   f.offsets = [offset];
//                   if (formatTags.length > 0) {
//                   } else {
//                     unmergedFormatTags.push(f);
//                   }
//                 }
//               }
//             );
//           }
//           console.log(unmergedFormatTags);
//         }
//       );
//       console.log(verseMarkDown);
//       // console.log(verse.nodeName);

//       // console.log(verse);
//     }
//   );
// }

// window.addEventListener(
//   'load',
//   async (): Promise<void> => {
//     const document = window.document;
//     verses = (await run(document, Environment.browser)) as LDSSourceVerse[];

//     renderVerses(verses);
//     console.log(verses);
//     await loadNotes();
//   }
// );
// export function main() {}
