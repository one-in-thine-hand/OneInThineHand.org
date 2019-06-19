import { ReferenceLabel } from './Note';
import { NoteCategory } from './NoteType';
export const ReferenceLabels: ReferenceLabel[] = [
  {
    sortOrder: 0,
    className: 'reference-label-alt',
    noteCategory: NoteCategory.ALT,
    referenceLabelName: 'Alternative Reading',
    visible: true,
    referenceLabelShortName: 'ALT',
  },
  {
    sortOrder: 0,
    className: 'reference-label-bd',
    noteCategory: NoteCategory.BD,
    referenceLabelName: 'Bible Dictionary',
    visible: true,
    referenceLabelShortName: 'BD',
  },
  {
    sortOrder: 0,
    className: 'reference-label-cross-ref',
    noteCategory: NoteCategory.CR,
    referenceLabelName: 'Cross Reference',
    visible: true,
    referenceLabelShortName: 'CR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-error',
    noteCategory: NoteCategory.ERR,
    referenceLabelName: 'ERROR',
    visible: true,
    referenceLabelShortName: 'ERROR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-geography',
    noteCategory: NoteCategory.GEO,
    referenceLabelName: 'Geography',
    visible: true,
    referenceLabelShortName: 'GEO',
  },
  {
    sortOrder: 0,
    className: 'reference-label-greek',
    noteCategory: NoteCategory.GR,
    referenceLabelName: 'Greek',
    visible: true,
    referenceLabelShortName: 'GR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-gs',
    noteCategory: NoteCategory.GS,
    referenceLabelName: 'Guide to the Scriptures',
    visible: true,
    referenceLabelShortName: 'GS',
  },
  {
    sortOrder: 0,
    className: 'reference-label-harmony',
    noteCategory: NoteCategory.HMY,
    referenceLabelName: 'Harmony',
    visible: true,
    referenceLabelShortName: 'HMY',
  },
  {
    sortOrder: 0,
    className: 'reference-label-hebrew',
    noteCategory: NoteCategory.HEB,
    referenceLabelName: 'Hebrew',
    visible: true,
    referenceLabelShortName: 'HEB',
  },
  {
    sortOrder: 0,
    className: 'reference-label-history',
    noteCategory: NoteCategory.HST,
    referenceLabelName: 'History',
    visible: true,
    referenceLabelShortName: 'HST',
  },
  {
    sortOrder: 0,
    className: 'reference-label-ie',
    noteCategory: NoteCategory.IE,
    referenceLabelName: 'IE',
    visible: true,
    referenceLabelShortName: 'IE',
  },
  {
    sortOrder: 0,
    className: 'reference-label-or',
    noteCategory: NoteCategory.OR,
    referenceLabelName: 'OR',
    visible: true,
    referenceLabelShortName: 'OR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-phrasing',
    noteCategory: NoteCategory.PHR,
    referenceLabelName: 'Phrase',
    visible: true,
    referenceLabelShortName: 'PHR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-quotation',
    noteCategory: NoteCategory.QUO,
    referenceLabelName: 'Quotation',
    visible: true,
    referenceLabelShortName: 'QUO',
  },
  {
    sortOrder: 0,
    className: 'reference-label-tg',
    noteCategory: NoteCategory.TG,
    referenceLabelName: 'Topical Guide',
    visible: true,
    referenceLabelShortName: 'TG',
  },
  {
    sortOrder: 0,
    className: 'reference-label-translation',
    noteCategory: NoteCategory.TRN,
    referenceLabelName: 'Translation',
    visible: true,
    referenceLabelShortName: 'TRN',
  },
  {
    sortOrder: 0,
    className: 'reference-label-translation-1',
    noteCategory: NoteCategory.TRN1,
    referenceLabelName: 'Translation',
    visible: true,
    referenceLabelShortName: 'TRN',
  },
  {
    sortOrder: 0,
    className: 'reference-label-translation-2',
    noteCategory: NoteCategory.TRN2,
    referenceLabelName: 'Translation',
    visible: true,
    referenceLabelShortName: 'TRN',
  },
];

export function getReferenceLabelByClassName(
  className: string,
): ReferenceLabel | undefined {
  return ReferenceLabels.find(
    (refLabel): boolean => {
      return refLabel.className === className;
    },
  );
}
export function getReferenceLabelByNoteCategory(
  noteCategory: NoteCategory,
): ReferenceLabel | undefined {
  return ReferenceLabels.find(
    (refLabel): boolean => {
      return refLabel.noteCategory === noteCategory;
    },
  );
}
export function getReferenceLabelByReferenceLabelName(
  referenceLabelName: string,
): ReferenceLabel | undefined {
  return ReferenceLabels.find(
    (refLabel): boolean => {
      return refLabel.referenceLabelName === referenceLabelName;
    },
  );
}
export function getReferenceLabelByReferenceLabelShortName(
  referenceLabelShortName: string,
): ReferenceLabel | undefined {
  return ReferenceLabels.find(
    (refLabel): boolean => {
      return refLabel.referenceLabelShortName === referenceLabelShortName;
    },
  );
}
