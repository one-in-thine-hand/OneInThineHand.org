// import * as he from 'he';

// import * as he from 'he';
export enum NoteType {
  Eng = 2,
  New = 1,
  TC = 3,
}

export const enum NoteCategory {
  ALT,
  BD,
  CR,
  ERR,
  GEO,
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

export class NoteTypeConvert {
  public noteType: NoteType;
  public className: string;
}

export class ReferenceLabel {
  public noteCategory: NoteCategory;
  public className: string;
  public referenceLabelName: string;
  public referenceLabelShortName: string;
}

export const NoteTypeConverts: NoteTypeConvert[] = [
  { noteType: NoteType.Eng, className: 'eng-note' },
  { noteType: NoteType.New, className: 'new-note' },
  { noteType: NoteType.TC, className: 'tc-note' },
];

export const ReferenceLabels: ReferenceLabel[] = [
  {
    className: 'reference-label-alt',
    noteCategory: NoteCategory.ALT,
    referenceLabelName: 'Alternative Reading',
    referenceLabelShortName: 'ALT',
  },
  {
    className: 'reference-label-bd',
    noteCategory: NoteCategory.BD,
    referenceLabelName: 'Bible Dictionary',
    referenceLabelShortName: 'BD',
  },
  {
    className: 'reference-label-cr',
    noteCategory: NoteCategory.CR,
    referenceLabelName: 'Cross Reference',
    referenceLabelShortName: 'CR',
  },
  {
    className: 'reference-label-err',
    noteCategory: NoteCategory.ERR,
    referenceLabelName: 'ERROR',
    referenceLabelShortName: 'ERR',
  },
  {
    className: 'reference-label-geo',
    noteCategory: NoteCategory.GEO,
    referenceLabelName: 'Geography',
    referenceLabelShortName: 'GEO',
  },
  {
    className: 'reference-label-gs',
    noteCategory: NoteCategory.GS,
    referenceLabelName: 'Guide to the Scriptures',
    referenceLabelShortName: 'GS',
  },
  {
    className: 'reference-label-hmy',
    noteCategory: NoteCategory.HMY,
    referenceLabelName: 'Harmony',
    referenceLabelShortName: 'HMY',
  },
  {
    className: 'reference-label-heb',
    noteCategory: NoteCategory.HEB,
    referenceLabelName: 'Hebrew',
    referenceLabelShortName: 'HEB',
  },
  {
    className: 'reference-label-hst',
    noteCategory: NoteCategory.HST,
    referenceLabelName: 'History',
    referenceLabelShortName: 'HST',
  },
  {
    className: 'reference-label-ie',
    noteCategory: NoteCategory.IE,
    referenceLabelName: 'IE',
    referenceLabelShortName: 'IE',
  },
  {
    className: 'reference-label-or',
    noteCategory: NoteCategory.OR,
    referenceLabelName: 'OR',
    referenceLabelShortName: 'OR',
  },
  {
    className: 'reference-label-phr',
    noteCategory: NoteCategory.PHR,
    referenceLabelName: 'Phrase',
    referenceLabelShortName: 'PHR',
  },
  {
    className: 'reference-label-quo',
    noteCategory: NoteCategory.QUO,
    referenceLabelName: 'Quotation',
    referenceLabelShortName: 'QUO',
  },
  {
    className: 'reference-label-tg',
    noteCategory: NoteCategory.TG,
    referenceLabelName: 'Topical Guide',
    referenceLabelShortName: 'TG',
  },
  {
    className: 'reference-label-trn',
    noteCategory: NoteCategory.TRN,
    referenceLabelName: 'Translation',
    referenceLabelShortName: 'TRN',
  },
];

export class NoteRef {
  public _id: string | undefined;
  // tslint:disable-next-line:variable-name
  public _rev: string | undefined;
  public classList: string[] | undefined;
  public noteCategory: NoteCategory | undefined;

  public text: string | undefined;
  // public type: NoteType | undefined;
  public visible: boolean | undefined;
}

export class NotePhrase {
  // tslint:disable-next-line:variable-name
  public _id: string | undefined;
  // tslint:disable-next-line:variable-name
  public _rev: string | undefined;
  public classList: string[] | undefined;
  public text: string | undefined;
  public visible: boolean | undefined;
}

export class SecondaryNote {
  public classList: string[] | undefined;
  public id: string | undefined;
  public noteMarker: string | undefined | null;
  public notePhrase: NotePhrase | undefined;
  public noteRefs: NoteRef[] = [];
  public verseMarker: string | undefined | null;
  public highlight: boolean | undefined;
  public uncompressedOffsets: number[] | undefined;
  public offsets: string | undefined;
  public noteType: NoteType | undefined;
}

export class Note {
  public _id: string | undefined;
  public _rev: string | undefined;
  public noteID: string | undefined;
  public noteShortTitle: string | undefined;
  public noteTitle: string | undefined;
  public secondaryNotes: SecondaryNote[] | undefined;
  // public chapterDataAid: string | undefined;
}

export function getNoteReferenceLabel(noteRefElement: Element): NoteCategory {
  const refElement = noteRefElement.querySelector('[class*="reference-label"]');
  if (refElement) {
    const referenceLabel = ReferenceLabels.find(
      (refLabel): boolean => {
        return refLabel.className === refElement.className;
      },
    );

    refElement.remove();

    return referenceLabel
      ? (referenceLabel.noteCategory as NoteCategory)
      : NoteCategory.ERR;
  } else {
    return NoteCategory.ERR;
  }
}
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
