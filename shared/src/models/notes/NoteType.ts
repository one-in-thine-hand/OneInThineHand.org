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
    className: 'overlay-new-notes',
    shortName: 'Test',
    longName: 'Test',
    visible: true,
  },
  {
    noteType: NoteType.EXISTING,
    className: 'overlay-eng-notes',
    shortName: 'Existing',
    longName: 'Existing',
    visible: true,
  },
  {
    noteType: NoteType.TC,
    className: 'overlay-tc-notes',
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
