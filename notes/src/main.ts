import {
  Note,
  SecondaryNote,
  getElementsAttribute,
  NotePhrase,
  NoteRef,
} from '../../shared/src/shared';
import { bookNames } from './consts';
import {
  getNoteReferenceLabel,
  getNoteType,
} from '../../shared/src/models/notes/Note';
import * as he from 'he';

// function parseInnerHTML(element: Element, selector: string): string {
//   const childElement = element.querySelector(selector);
//   return childElement ? childElement.innerHTML : '';
// }

function parseNotePhrase(element: Element): NotePhrase | undefined {
  const notePhraseElement = element.querySelector('.note-phrase');
  if (notePhraseElement === null || !notePhraseElement.innerHTML) {
    return undefined;
  }
  const notePhrase = new NotePhrase();

  // notePhrase.classList = Array.from(notePhraseElement.classList.values());
  notePhrase.text = he.decode(notePhraseElement.innerHTML);
  return notePhrase;
}

function parseNoteRefs(element: Element): NoteRef[] {
  const noteRefElements = element.querySelectorAll('.note-reference');

  if (noteRefElements.length === 0) {
    throw `${element.id} is missing note refs`;
  }

  return Array.from(noteRefElements).map(
    (noteRefElement): NoteRef => {
      const noteRef = new NoteRef();
      // noteRef.classList = Array.from(noteRefElement.classList.values());
      noteRef.noteCategory = getNoteReferenceLabel(noteRefElement);
      noteRef.text = he.decode(noteRefElement.innerHTML);
      return noteRef;
    },
  );
}

function parseSecondaryNotes(noteElement: Element): SecondaryNote[] {
  return Array.from(noteElement.childNodes)
    .filter(
      (childNode): boolean => {
        return childNode.nodeName.toLowerCase() === 'div';
      },
    )
    .map(
      (secondaryNoteElement: Element): SecondaryNote => {
        const secondaryNote = new SecondaryNote();
        secondaryNote.id = secondaryNoteElement.id;

        if (!secondaryNote.id.includes('eng-note')) {
          secondaryNote.id = `${secondaryNote.id}`;
        }

        secondaryNote.noteMarker = getElementsAttribute(
          secondaryNoteElement,
          'note-marker',
        );
        secondaryNote.verseMarker = getElementsAttribute(
          secondaryNoteElement,
          'verse-marker',
        );
        secondaryNote.notePhrase = parseNotePhrase(secondaryNoteElement);

        secondaryNote.noteRefs = parseNoteRefs(secondaryNoteElement);

        secondaryNote.noteType = getNoteType(secondaryNoteElement);
        secondaryNote.offsets = getElementsAttribute(
          secondaryNoteElement,
          'offsets',
        );
        return secondaryNote;
      },
    );
}

async function isNoteFile(document: Document): Promise<boolean> {
  return document.querySelector('div.chapter') !== null;
}

// function parseVerseNumber(noteElement: Element, chapterID: string): string {
//   const verseMarkerElement = noteElement.querySelector('[verse-marker]');
//   let verseMarker: string | null = null;
//   if (verseMarkerElement) {
//     verseMarker = verseMarkerElement.getAttribute('verse-marker');
//   }
//   if (verseMarker !== null) {
//     // console.log(verseMarker);

//     return verseMarker;
//   } else {
//     const name = bookNames.find(
//       (bookName): boolean => {
//         return chapterID.startsWith(bookName.startsWith);
//       },
//     );
//     return name
//       ? chapterID
//           .replace(name.startsWith, '')
//           .replace('-eng-chapter', '')
//           .replace('-tc-chapter', '')
//           .replace('-new-chapter', '')
//       : '';
//   }

//   return noteElement.id
//     .replace(
//       chapterID
//         .replace('-eng-chapter', '')
//         .replace('-tc-chapter', '')
//         .replace('-new-chapter', ''),
//       '',
//     )
//     .replace('-eng-note', '')
//     .replace('-', '');
// }

function parseShortTitle(verseMarker: string): string {
  return `Verse ${verseMarker} Notes`;
}
function parseNoteTitle(verseMarker: string, chapterID: string): string {
  const name = bookNames.find(
    (bookName): boolean => {
      return chapterID.startsWith(bookName.startsWith);
    },
  );

  verseMarker = verseMarker;
  if (!name) {
    throw chapterID;
  }
  return `${name ? name.fullName : ''} ${
    name
      ? chapterID
          .replace(name.startsWith, '')
          .replace('-eng-chapter', '')
          .replace('-tc-chapter', '')
          .replace('-new-chapter', '')
      : ''
  }:${verseMarker} Notes`;
}

export class ChapterNotes {
  public _id: string;
  public _rev: string | undefined;
  public notes: Note[] | undefined;
}
export class NoteProcessor {
  public notesMap: Map<string, Note[]> = new Map();
  public chapterNotesMap: Map<string, ChapterNotes> = new Map();

  /**
   * main
   */
  public async run(
    document: Document,
  ): Promise<Map<string, ChapterNotes> | undefined> {
    if (await isNoteFile(document)) {
      Array.from(document.querySelectorAll('div.chapter')).map(
        (chapterElement): void => {
          const id = chapterElement.id;
          // const notes: Note[] = [];
          // console.log(id);

          const chapterNotes = new ChapterNotes();
          chapterNotes._id = id.replace('chapter', 'notes');

          const notes = Array.from(chapterElement.childNodes)
            .filter(
              (node): boolean => {
                return node.nodeName.toLowerCase() === 'note';
              },
            )
            .map(
              (noteElement: Element): Note => {
                const note = new Note();
                note._id = noteElement.id;

                if (!note._id.includes('eng-note')) {
                  note._id = `${note._id}-eng-note`;
                }
                const verseMarker = note._id.split('-')[2];
                // console.log(verseMarker);

                // const verseMarker = parseVerseNumber(
                //   noteElement,
                //   chapterElement.id,
                // );
                // console.log(note._id.split('-')[1]);

                note.noteShortTitle = parseShortTitle(verseMarker);
                note.noteTitle = parseNoteTitle(verseMarker, chapterElement.id);
                // console.log(note.noteShortTitle);
                // console.log(note.noteTitle);

                note.secondaryNotes = parseSecondaryNotes(noteElement);

                // console.log(note.secondaryNotes);
                return note;
              },
            );
          // console.log(`${id} ${notes.length} ${this.notesMap.size}`);

          chapterNotes.notes = notes;
          // console.log(chapterNotes.notes[0].secondaryNotes);

          this.chapterNotesMap.set(chapterNotes._id, chapterNotes);
          this.notesMap.set(id, notes);
        },
      );
      // console.log(this.notesMap.size);
      return this.chapterNotesMap;
    } else {
      return undefined;
    }
  }
}
