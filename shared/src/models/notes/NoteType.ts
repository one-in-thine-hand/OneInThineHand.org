// import * as he from 'he';
// import * as he from 'he';
export enum NoteType {
  New = 1,
  Eng = 2,
  TC = 3,
  EngOverlay = 4,
}

export class NoteTypeConvert {
  public noteType: NoteType;
  public className: string;
  public shortName: string;
  public longName: string;
}
export const NoteTypeConverts: NoteTypeConvert[] = [
  {
    noteType: NoteType.Eng,
    className: 'eng-note',
    shortName: 'Eng',
    longName: 'English Notes',
  },
  {
    noteType: NoteType.New,
    className: 'new-note',
    shortName: 'New',
    longName: 'Note',
  },
  {
    noteType: NoteType.TC,
    className: 'tc-note',
    shortName: 'TC',
    longName: 'Translators Copy',
  },
  {
    noteType: NoteType.EngOverlay,
    className: 'eng-overlay',
    shortName: 'ENG',
    longName: 'English OverLay',
  },
];

export function getNoteType(
  secondaryNoteElement: Element,
): NoteType | undefined {
  const noteType = NoteTypeConverts.find(
    (noteTypeConvert): boolean => {
      return noteTypeConvert.className === secondaryNoteElement.className;
    },
  );

  return noteType ? noteType.noteType : undefined;
}
