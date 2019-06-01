/*
  normalizeCharacterCounts(document: Document) modifies LDS Source files before the rest of the processing to ensure that the character counts are accurate.
  At the time of this writing, May 26, 2019, there are extra characters including in Verse text of the scriptures that are not part of the scriptures.
  For example, there are super scripts linked to the notes through all verses. Right now, these extra characters are store along side the verse text and
  are in some senses treated as part of the that Verse, and if considered part of the verse text they would be added to the character count.

  Due to the strong desire to preserve the textual integrity of the scripture text, verse text only including the verse text, the developer of this code
  decided to treat these extra characters seperatly.
*/

export async function normalizeCharacterCounts(
  document: Document,
): Promise<void> {
  Array.from(document.querySelectorAll('.study-note-ref')).map(
    (studyNoteRef): void => {
      const marker = studyNoteRef.querySelector('sup');
      if (marker) {
        // preserveSuperScript(studyNoteRef, marker);
        marker.remove();
      }
      studyNoteRef.classList.remove('study-note-ref');
      studyNoteRef.classList.remove('scripture-ref');
    },
  );
  Array.from(document.querySelectorAll('.clarity-word,.dominant')).map(
    (clarityWord): void => {
      const a = clarityWord.querySelector('a') as HTMLAnchorElement;

      if (a) {
        const className = a.className;
        const href = a.href;
        const marker = a.getAttribute('marker');

        clarityWord.className = `${clarityWord.className} ${className}`;
        clarityWord.setAttribute('n-href', href);

        if (marker) {
          clarityWord.setAttribute('marker', marker);
        }
        clarityWord.innerHTML = clarityWord.textContent
          ? clarityWord.textContent
          : '';
      }
    },
  );
}

export function preserveSuperScript(
  studyNoteRef: Element,
  marker: HTMLElement,
): void {
  studyNoteRef.setAttribute(
    'marker',
    marker.textContent ? marker.textContent : marker.innerHTML,
  );
}

// export async function replaceInnerHTML(
//   selector: string,
//   newInnerHTML: string | string[],
// ): Promise<void> {
//   const element = document.querySelector(selector);

//   if (element) {
//     // let text: string;

//     // if ((newInnerHTML as []).length !== undefined) {
//     //  (newInnerHTML as string[]).map((iH): void =>{
//     //    text =
//     //  })
//     // } else {
//     //   text = newInnerHTML as string;
//     // }
//   } else {
//     throw `No element with selector: ${selector} could be found on the page`;
//   }
// }
