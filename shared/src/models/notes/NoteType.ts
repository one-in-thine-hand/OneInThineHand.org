// import * as he from 'he';
// import * as he from 'he';

// import * as he from 'he';
// import * as he from 'he';
// import * as he from 'he';
// import * as he from 'he';
// import * as he from 'he';
// import * as he from 'he';
export const enum NoteCategory {
  ERR = 100000,
  HMY = 0,
  QUO = 1,
  PHR = 2,
  TRN = 3,
  ALT = 4,
  CR = 5,
  HST = 6,
  GEO = 7,
  GR = 8,
  HEB = 9,
  IE = 10,
  OR = 11,
  TG = 12,
  BD = 13,
  GS = 14,
  TRN1 = 15,
  TRN2 = 16,
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
  public visible: boolean;
}
export const NoteTypeConverts: NoteTypeConvert[] = [
  {
    noteType: NoteType.PRINT,
    className: 'overlay-print',
    shortName: 'Print',
    longName: 'Print',
    visible: true,
  },
  {
    noteType: NoteType.TRANSLATION,
    className: 'overlay-trn',
    shortName: 'Translation',
    longName: 'Translation',
    visible: true,
  },
  {
    noteType: NoteType.TEST,
    className: 'overlay-new-note',
    shortName: 'Test',
    longName: 'Test',
    visible: true,
  },
  {
    noteType: NoteType.EXISTING,
    className: 'overlay-eng-note',
    shortName: 'Existing',
    longName: 'Existing',
    visible: true,
  },
  {
    noteType: NoteType.TC,
    className: 'overlay-tc-note',
    shortName: 'TC',
    longName: 'TC',
    visible: true,
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
