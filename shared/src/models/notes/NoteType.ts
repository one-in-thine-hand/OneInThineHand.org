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
  QUO = 0,
  PHR = 1,
  TRN = 2,
  ALT = 3,
  OR = 4,
  IE = 5,
  CR = 6,
  HMY = 7,
  HST = 8,
  GEO = 9,
  DOCT = 10,
  GR = 11,
  TG = 12,
  BD = 13,
  GS = 14,
  HEB = 15,
  TRN1 = 16,
  TRN2 = 17,
  QUO1 = 18,
  QUO2 = 19,
  OR1 = 20,
  OR2 = 21,
}

export enum NoteType {
  PRINT,
  HARMONY,
  JST,
  QUO,
  Phrasing,
  TRANSLATION,
  TEST,
  EXISTING,
  TC,
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
    noteType: NoteType.HARMONY,
    className: 'overlay-hmy',
    shortName: 'Harmony',
    longName: 'Harmony',
    visible: true,
  },
  {
    noteType: NoteType.JST,
    className: 'overlay-jst',
    shortName: 'JST',
    longName: 'JST',
    visible: true,
  },
  {
    noteType: NoteType.QUO,
    className: 'overlay-quo',
    shortName: 'QUO',
    longName: 'Quotation',
    visible: true,
  },
  {
    noteType: NoteType.Phrasing,
    className: 'overlay-phr',
    shortName: 'PHR',
    longName: 'Phrasing',
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
