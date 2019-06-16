import { Visibility } from '../../interfaces/visibliity';
import { FormatTag, RefTag } from '../format_tags/FormatTag';
import { getReferenceLabelByClassName } from './ReferenceLabels';

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

export interface NumericalOrder {
  sortOrder: number;
}

export class NoteTypeConvert {
  public noteType: NoteType;
  public className: string;
}

export class ReferenceLabel implements Visibility, NumericalOrder {
  public sortOrder: number;
  public visible: boolean | undefined;
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

export class NoteRef implements Visibility {
  public _id: string | undefined;

  public _rev: string | undefined;
  // public classList: string[] | undefined;
  public noteCategory: NoteCategory | undefined;

  public text: string | undefined;
  // public type: NoteType | undefined;
  public visible: boolean | undefined;
}

export class NotePhrase implements Visibility {
  public _id: string | undefined;

  public _rev: string | undefined;
  // public classList: string[] | undefined;
  public text: string | undefined;
  public visible: boolean | undefined;
}

export class Note implements Visibility {
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
  public visible: boolean | undefined;
  public formatTag: FormatTag | undefined;
  public refTag: RefTag | undefined;
}

export class VerseNotes {
  public _id: string | undefined;
  public _rev: string | undefined;
  public noteID: string | undefined;
  public noteShortTitle: string | undefined;
  public noteTitle: string | undefined;
  public secondaryNotes: Note[] | undefined;
  // public chapterDataAid: string | undefined;
}

export function getNoteReferenceLabel(noteRefElement: Element): NoteCategory {
  const refElement = noteRefElement.querySelector('[class*="reference-label"]');
  if (refElement) {
    const referenceLabel = getReferenceLabelByClassName(refElement.className);

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
