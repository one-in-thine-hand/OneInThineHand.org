import { Note } from '../../shared/src/shared';

async function isNoteFile(document: Document): Promise<boolean> {
  return document.querySelector('div.chapter') !== null;
}

export class NoteProcessor {
  public notesMap: Map<string, Note[]> = new Map();

  /**
   * isNoteFile
   */
  /**
   * main
   */
  public async run(
    document: Document,
  ): Promise<Map<string, Note[]> | undefined> {
    if (await isNoteFile(document)) {
      Array.from(document.querySelectorAll('div.chapter')).map(
        (chapterElement): void => {
          // const id = chapterElement.id;
          // const notes: Note[] = [];

          Array.from(chapterElement.querySelectorAll('note')).map(
            (noteElement): void => {
              // const note = new Note();

              Array.from(noteElement.childNodes)
                .filter(
                  (childNode): boolean => {
                    return childNode.nodeName === 'DIV';
                  },
                )
                .map(
                  (node: Element): void => {
                    console.log(node.nodeName);
                  },
                );
            },
          );
        },
      );
      return this.notesMap;
    } else {
      return undefined;
    }
  }
}
