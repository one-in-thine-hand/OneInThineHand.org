import {
  VerseNotes,
  Note,
  getElementsAttribute,
  NotePhrase,
  NoteRef,
} from '../../shared/src/shared';
import { bookNames } from './consts';
import { getNoteType } from '../../shared/src/shared';
import * as he from 'he';
import {
  getNoteReferenceLabel,
  noteRefHasNoneClass,
} from '../../shared/src/models/notes/Note';

function parseNotePhrase(element: Element): NotePhrase | undefined {
  const notePhraseElement = element.querySelector('.note-phrase');
  if (notePhraseElement === null || !notePhraseElement.innerHTML) {
    return undefined;
  }
  const notePhrase = new NotePhrase();

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

      noteRef.noteCategory = getNoteReferenceLabel(noteRefElement);

      if (noteRefHasNoneClass(noteRefElement)) {
        noteRef.none = true;
      }
      noteRef.text = he.decode(noteRefElement.innerHTML);
      return noteRef;
    },
  );
}

function parseNotes(verseNotes: Element): Note[] {
  return Array.from(verseNotes.childNodes)
    .filter(
      (childNode): boolean => {
        return childNode.nodeName.toLowerCase() === 'note';
      },
    )
    .map(
      (noteElement: Element): Note => {
        const note = new Note();
        note.id = noteElement.id;

        if (!note.id.includes('eng-note')) {
          note.id = `${note.id}`;
        }

        note.noteMarker = getElementsAttribute(noteElement, 'note-marker');
        note.verseMarker = getElementsAttribute(noteElement, 'verse-marker');
        note.notePhrase = parseNotePhrase(noteElement);

        note.noteRefs = parseNoteRefs(noteElement);

        note.noteType = getNoteType(noteElement);
        note.offsets = getElementsAttribute(noteElement, 'offsets');
        return note;
      },
    );
}

async function isNoteFile(document: Document): Promise<boolean> {
  return document.querySelector('chapter') !== null;
}

function parseShortTitle(verseMarker: string): string {
  return `Verse ${verseMarker} Notes`;
}
function parseNoteTitle(verseMarker: string, chapterID: string): string {
  const lang = chapterID.split('-')[0];
  // console.log(lang);

  const name = bookNames.find(
    (bookName): boolean => {
      return chapterID.replace(`${lang}-`, '').startsWith(bookName.startsWith);
    },
  );

  // console.log(name);

  verseMarker = verseMarker;
  if (!name) {
    console.log(lang);

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
  public verseNotes: VerseNotes[] | undefined;
  public save: boolean | undefined;
}

export class NoteProcessor {
  public notesMap: Map<string, VerseNotes[]> = new Map();
  public chapterNotesMap: Map<string, ChapterNotes> = new Map();

  /**
   * main
   */
  public async run(
    document: Document,
  ): Promise<Map<string, ChapterNotes> | undefined> {
    if (await isNoteFile(document)) {
      Array.from(document.querySelectorAll('chapter')).map(
        (chapterElement): void => {
          const id = chapterElement.id;

          const chapterNotes = new ChapterNotes();
          chapterNotes._id = id.replace('chapter', 'notes');

          const notes = Array.from(chapterElement.childNodes)
            .filter(
              (node): boolean => {
                return node.nodeName.toLowerCase() === 'verse-notes';
              },
            )
            .map(
              (noteElement: Element): VerseNotes => {
                const verseNotes = new VerseNotes();
                try {
                  verseNotes._id = noteElement.id;

                  let verseMarker = ''; //verseNotes._id.split('-')[3];

                  verseMarker = verseNotes._id.split('-')[3];

                  verseNotes.noteShortTitle = parseShortTitle(verseMarker);
                  verseNotes.noteTitle = parseNoteTitle(
                    verseMarker,
                    chapterElement.id,
                  );

                  verseNotes.notes = parseNotes(noteElement);
                } catch (error) {
                  console.log(error);
                  // verseMarker = '';
                }
                return verseNotes;
              },
            );

          chapterNotes.verseNotes = notes;

          this.chapterNotesMap.set(chapterNotes._id, chapterNotes);
          this.notesMap.set(id, notes);
        },
      );

      return this.chapterNotesMap;
    } else {
      return undefined;
    }
  }
}
