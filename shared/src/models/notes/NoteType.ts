// import * as he from 'he';
// import * as he from 'he';

export const enum NoteCategory {
  ALT,
  BD,
  CR,
  ERR,
  GEO,
  GR,
  GS,
  HMY,
  HEB,
  HST,
  IE,
  OR,
  PHR,
  QUO,
  TG,
  TRN,
}

export enum NoteType {
  PRINT = 0,
  TRANSLATION = 1,
  TEST = 2,
  EXISTING = 3,
  TC = 4,
}

export class NoteTypeConvert {
  public noteType: NoteType;
  public className: string;
  public shortName: string;
  public longName: string;
}
export const NoteTypeConverts: NoteTypeConvert[] = [
  {
    noteType: NoteType.PRINT,
    className: 'overlay-print',
    shortName: 'Print',
    longName: 'Print',
  },
  {
    noteType: NoteType.TRANSLATION,
    className: 'overlay-trn',
    shortName: 'Translation',
    longName: 'Translation',
  },
  {
    noteType: NoteType.TEST,
    className: 'overlay-new-notes',
    shortName: 'Test',
    longName: 'Test',
  },
  {
    noteType: NoteType.EXISTING,
    className: 'overlay-eng-notes',
    shortName: 'Existing',
    longName: 'Existing',
  },
  {
    noteType: NoteType.TC,
    className: 'overlay-tc-notes',
    shortName: 'TC',
    longName: 'TC',
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
