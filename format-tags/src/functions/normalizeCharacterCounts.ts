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
      // console.log(studyNoteRef.querySelectorAll('sup').length);

      if (marker) {
        // preserveSuperScript(studyNoteRef, marker);
        // console.log(marker.innerHTML);

        marker.remove();
      }
      studyNoteRef.classList.remove('study-note-ref');
      studyNoteRef.classList.remove('scripture-ref');
      // console.log(studyNoteRef.childNodes.length);
      // const parentElement = studyNoteRef.parentElement;
      // console.log(
      // `${parentElement ? parentElement.outerHTML : ''} ${
      //   parentElement ? (parentElement.textContent as string).length : ''
      // }`,
      // );
      // console.log(parentElement ? parentElement.outerHTML : '');
      // console.log(parentElement ? parentElement.textContent : '');

      Array.from(studyNoteRef.childNodes)
        .filter(
          (childNode): boolean => {
            return childNode.nodeName === '#text';
          },
        )
        .map(
          (childNode): void => {
            // const newNode = `<span>${childNode.textContent}</span>`;
            // console.log(childNode);
            // childNode.replaceWith(newNode);
            const s = document.createElement('span');
            s.innerHTML = childNode.textContent as string;
            studyNoteRef.replaceChild(s, childNode);
          },
        );
      studyNoteRef.insertAdjacentHTML('beforebegin', studyNoteRef.innerHTML);

      // Array.from(studyNoteRef.childNodes)
      //   .filter(
      //     (childNode): boolean => {
      //       return childNode.nodeName === '#text';
      //     },
      //   )
      //   .map(
      //     (childNode): void => {
      //       // const newNode = `<span>${childNode.textContent}</span>`;
      //       console.log(childNode);
      //       // childNode.replaceWith(newNode);
      //     },
      //   );
      studyNoteRef.remove();
      // console.log(parentElement ? parentElement.textContent : '');

      // Array.from(studyNoteRef.childNodes).map((node): void => {});
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
