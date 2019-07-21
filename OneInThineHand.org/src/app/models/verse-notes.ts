export const enum FormatGroupType {
  A = 0,
  Text = 1,
  Ruby = 2,
  ARuby = 3,
  RB = 4,
  RT = 5,
  SPAN = 6,
  BR = 7,
  PAGE_BREAK = 8,
  Part = 9,
  Segment = 10,
  Line = 11,
  Block = 12,
  Note = 13,
  Para = 14,
  LineGap = 15,
  ParaGap = 16,
  BlockGap = 17,
  Breaks,
  Gaps,
}
export abstract class FormatGroup {
  public classList: string[] | undefined;
  public fMerges: FMerged[] | undefined;
  public formatGroupType: FormatGroupType | undefined;
  public offsets: string | undefined;
  public uncompressedOffsets: number[] | undefined;
}

export class FormatGroupA extends FormatGroup {
  public formatGroupType = FormatGroupType.A;
  public href: string | undefined;
}

export class FormatGroupRuby extends FormatGroup {
  public formatGroupRB: FormatGroupRB | undefined;
  public formatGroupRT: FormatGroupRT | undefined;
  public formatGroupType = FormatGroupType.Ruby;
}
export class FormatGroupRT extends FormatGroup {
  public formatGroupType = FormatGroupType.RT;
  public formatTags: FormatTag[] | undefined;
}
export class FormatGroupRB extends FormatGroup {
  public formatGroupType = FormatGroupType.RB;
  public formatTags: FormatTag[] | undefined;
}
export class FormatGroupRubyA extends FormatGroup {
  public formatGroupRuby: FormatGroupRuby | undefined;
  public formatGroupType: FormatGroupType = FormatGroupType.ARuby;
}

export class FormatGroupText extends FormatGroup {
  public formatGroupType = FormatGroupType.Text;
}
export class FormatGroupBR extends FormatGroup {
  public classList = undefined;
  public formatGroupType = FormatGroupType.BR;
  public offsets = undefined;
}
export class FormatGroupSegment extends FormatGroup {
  public formatGroupType = FormatGroupType.Segment;
  public kjvRef: string[] | undefined;
}
export class FormatGroupPart extends FormatGroup {
  public formatGroupType = FormatGroupType.Part;
  public kjvRef: string[] | undefined;
}
export class FormatGroupPara extends FormatGroup {
  public formatGroupType = FormatGroupType.Para;
}
export class FormatGroupLine extends FormatGroup {
  public formatGroupType = FormatGroupType.Line;
}
export class FormatGroupLineGap extends FormatGroup {
  public formatGroupType = FormatGroupType.LineGap;
}
export class FormatGroupParaGap extends FormatGroup {
  public formatGroupType = FormatGroupType.ParaGap;
}
export class FormatGroupBlock extends FormatGroup {
  public formatGroupType = FormatGroupType.Block;
}
export class FormatGroupBlockGap extends FormatGroup {
  public formatGroupType = FormatGroupType.BlockGap;
}
export class FormatGroupBreaks extends FormatGroup {
  public formatGroupType = FormatGroupType.Breaks;
}
export class FormatGroupGaps extends FormatGroup {
  public formatGroupType = FormatGroupType.Gaps;
}
export class FormatGroupPageBreak extends FormatGroup {
  public classList = ['page-break'];
  public formatGroupType = FormatGroupType.BR;
  public offsets = undefined;
}

export class FormatTag {
  public classList: string[] | undefined;
  public displayAs: DisplayAs | undefined;
  public formatType: FormatTagType | undefined;
  public offsets: string | undefined;
  public optional: Optional | undefined;
  public refs: string[] | undefined;
  public text: string | undefined;
  public uncompressedOffsets: number[] | undefined;
  public visible: boolean | undefined;
}

export class RefTag {
  public highlight = false;
  public noteType: number;
  public offsets: string | undefined;
  public pronunciation?: boolean;
  public pronunciationHref?: string;
  public refs: string[];
  public secondaryNoteID: string;
  public uncompressedOffsets: number[] | undefined;
}

export class FMerged {
  public breaks: FormatTag[] | undefined;
  public formatTags: FormatTag[] | undefined;
  public offsets: number[] = [];
  public pronunciation: boolean | undefined;
  public pronunciationIcon?: boolean;
  public refTags: RefTag[] | undefined;
  public text = '';
}
export const enum NoteCategoryOverlay {} // tslint:disable:completed-docs
export const enum NoteCategorySort {
  ERR = 100000,
  QUO,
  PHR,
  TRN,
  ALT,
  OR,
  IE,
  CR,
  HMY,
  HST,
  GEO,
  DOCT,
  GR,
  TG,
  BD,
  GS,
  HEB,
  TRN1,
  TRN2,
  QUO1,
  QUO2,
  OR1,
  OR2,
  ORT1,
  ORT2,
  IEQUO,
  IEQUO1,
  IEQUO2,
  NONE,
  pronunciation1,
  pronunciation2,
  PHR1,
  PHR2,
  CRNOTJST,
  GEO1,
  GEO2,
  HST1,
  HST2,
  PHRQUO,
  PHRQUO1,
  PHRQUO2,
  PHRNOTQUO,
  PHRNOTQUO1,
  PHRNOTQUO2,
  QUONONE,
  QUO2NONE,
  ORTRN1,
  ORTRN2,
}

export class NoteCategory {
  public className: string;
  public noteCategory: NoteCategorySort;
  public noteCategoryName: string;
  public noteCategoryShortName: string;
  public sortOrder: number;
  public visible: boolean | undefined;
}
export const NOTE_CATEGORIES: NoteCategory[] = [
  {
    className: 'reference-label-alt',
    noteCategory: NoteCategorySort.ALT,
    sortOrder: 0,
    noteCategoryName: 'ALT',
    visible: true,
    noteCategoryShortName: 'ALT',
  },
  {
    className: 'reference-label-bd',
    noteCategory: NoteCategorySort.BD,
    sortOrder: 0,
    noteCategoryName: 'BD',
    visible: true,
    noteCategoryShortName: 'BD',
  },
  {
    className: 'reference-label-gs',
    noteCategory: NoteCategorySort.GS,
    sortOrder: 0,
    noteCategoryName: 'GS',
    visible: true,
    noteCategoryShortName: 'GS',
  },
  {
    className: 'reference-label-harmony',
    noteCategory: NoteCategorySort.HMY,
    sortOrder: 0,
    noteCategoryName: 'HMY',
    visible: true,
    noteCategoryShortName: 'HMY',
  },
  {
    className: 'reference-label-heb',
    noteCategory: NoteCategorySort.HEB,
    sortOrder: 0,
    noteCategoryName: 'HEB',
    visible: true,
    noteCategoryShortName: 'HEB',
  },
  {
    className: 'reference-label-tg',
    noteCategory: NoteCategorySort.TG,
    sortOrder: 0,
    noteCategoryName: 'TG',
    visible: true,
    noteCategoryShortName: 'TG',
  },
  {
    className: 'reference-label-greek',
    noteCategory: NoteCategorySort.GR,
    sortOrder: 0,
    noteCategoryName: 'GR',
    visible: true,
    noteCategoryShortName: 'GR',
  },
  {
    className: 'reference-label-gs',
    noteCategory: NoteCategorySort.GS,
    sortOrder: 0,
    noteCategoryName: 'GS',
    visible: true,
    noteCategoryShortName: 'GS',
  },
  {
    className: 'reference-label-bd',
    noteCategory: NoteCategorySort.BD,
    sortOrder: 0,
    noteCategoryName: 'BD',
    visible: true,
    noteCategoryShortName: 'BD',
  },
  {
    className: 'reference-label-alt',
    noteCategory: NoteCategorySort.ALT,
    sortOrder: 0,
    noteCategoryName: 'ALT',
    visible: true,
    noteCategoryShortName: 'ALT',
  },
  {
    className: 'reference-label-cross-ref',
    noteCategory: NoteCategorySort.CR,
    sortOrder: 0,
    noteCategoryName: 'CR',
    visible: true,
    noteCategoryShortName: 'CR',
  },
  {
    className: 'reference-label-cross-not-jst-ref',
    noteCategory: NoteCategorySort.CRNOTJST,
    sortOrder: 0,
    noteCategoryName: 'CR',
    visible: true,
    noteCategoryShortName: 'CR',
  },
  {
    className: 'reference-label-geography',
    noteCategory: NoteCategorySort.GEO,
    sortOrder: 0,
    noteCategoryName: 'GEO',
    visible: true,
    noteCategoryShortName: 'GEO',
  },
  {
    className: 'reference-label-geography-1',
    noteCategory: NoteCategorySort.GEO1,
    sortOrder: 0,
    noteCategoryName: 'GEO',
    visible: true,
    noteCategoryShortName: 'GEO',
  },
  {
    className: 'reference-label-geography-2',
    noteCategory: NoteCategorySort.GEO2,
    sortOrder: 0,
    noteCategoryName: 'GEO',
    visible: true,
    noteCategoryShortName: 'GEO',
  },
  {
    className: 'reference-label-harmony',
    noteCategory: NoteCategorySort.HMY,
    sortOrder: 0,
    noteCategoryName: 'HMY',
    visible: true,
    noteCategoryShortName: 'HMY',
  },
  {
    className: 'reference-label-history',
    noteCategory: NoteCategorySort.HST,
    sortOrder: 0,
    noteCategoryName: 'HST',
    visible: true,
    noteCategoryShortName: 'HST',
  },
  {
    className: 'reference-label-history-1',
    noteCategory: NoteCategorySort.HST1,
    sortOrder: 0,
    noteCategoryName: 'HST',
    visible: true,
    noteCategoryShortName: 'HST',
  },
  {
    className: 'reference-label-history-2',
    noteCategory: NoteCategorySort.HST2,
    sortOrder: 0,
    noteCategoryName: 'HST',
    visible: true,
    noteCategoryShortName: 'HST',
  },
  {
    className: 'reference-label-ie',
    noteCategory: NoteCategorySort.IE,
    sortOrder: 0,
    noteCategoryName: 'IE',
    visible: true,
    noteCategoryShortName: 'IE',
  },
  {
    className: 'reference-label-ie-quotation',
    noteCategory: NoteCategorySort.IEQUO,
    sortOrder: 0,
    noteCategoryName: 'IE',
    visible: true,
    noteCategoryShortName: 'IE',
  },
  {
    className: 'reference-label-ie-quotation-1',
    noteCategory: NoteCategorySort.IEQUO1,
    sortOrder: 0,
    noteCategoryName: 'IE',
    visible: true,
    noteCategoryShortName: 'IE',
  },
  {
    className: 'reference-label-ie-quotation-2',
    noteCategory: NoteCategorySort.IEQUO2,
    sortOrder: 0,
    noteCategoryName: 'IE',
    visible: true,
    noteCategoryShortName: 'IE',
  },
  {
    className: 'reference-label-phrasing',
    noteCategory: NoteCategorySort.PHR,
    sortOrder: 0,
    noteCategoryName: 'PHR',
    visible: true,
    noteCategoryShortName: 'PHR',
  },
  {
    className: 'reference-label-phrasing-1',
    noteCategory: NoteCategorySort.PHR1,
    sortOrder: 0,
    noteCategoryName: 'PHR',
    visible: true,
    noteCategoryShortName: 'PHR',
  },
  {
    className: 'reference-label-phrasing-2',
    noteCategory: NoteCategorySort.PHR2,
    sortOrder: 0,
    noteCategoryName: 'PHR',
    visible: true,
    noteCategoryShortName: 'PHR',
  },
  {
    className: 'reference-label-phrasing-quotation',
    noteCategory: NoteCategorySort.PHRQUO,
    sortOrder: 0,
    noteCategoryName: 'PHR',
    visible: true,
    noteCategoryShortName: 'PHR',
  },
  {
    className: 'reference-label-phrasing-1-quotation',
    noteCategory: NoteCategorySort.PHRQUO1,
    sortOrder: 0,
    noteCategoryName: 'PHR',
    visible: true,
    noteCategoryShortName: 'PHR',
  },
  {
    className: 'reference-label-phrasing-2-quotation',
    noteCategory: NoteCategorySort.PHRQUO2,
    sortOrder: 0,
    noteCategoryName: 'PHR',
    visible: true,
    noteCategoryShortName: 'PHR',
  },
  {
    className: 'reference-label-phrasing-not-quotation',
    noteCategory: NoteCategorySort.PHRNOTQUO,
    sortOrder: 0,
    noteCategoryName: 'PHR',
    visible: true,
    noteCategoryShortName: 'PHR',
  },
  {
    className: 'reference-label-phrasing-1-not-quotation',
    noteCategory: NoteCategorySort.PHRNOTQUO1,
    sortOrder: 0,
    noteCategoryName: 'PHR',
    visible: true,
    noteCategoryShortName: 'PHR',
  },
  {
    className: 'reference-label-phrasing-2-not-quotation',
    noteCategory: NoteCategorySort.PHRNOTQUO2,
    sortOrder: 0,
    noteCategoryName: 'PHR',
    visible: true,
    noteCategoryShortName: 'PHR',
  },
  {
    className: 'reference-label-pronunciation-2',
    noteCategory: NoteCategorySort.pronunciation2,
    sortOrder: 0,
    noteCategoryName: 'Pronunciation 2',
    visible: true,
    noteCategoryShortName: '🔊',
  },
  {
    className: 'reference-label-quotation',
    noteCategory: NoteCategorySort.QUO,
    sortOrder: 0,
    noteCategoryName: 'QUO',
    visible: true,
    noteCategoryShortName: 'QUO',
  },
  {
    className: 'reference-label-quotation-1',
    noteCategory: NoteCategorySort.QUO1,
    sortOrder: 0,
    noteCategoryName: 'QUO',
    visible: true,
    noteCategoryShortName: 'QUO',
  },
  {
    className: 'reference-label-quotation-2',
    noteCategory: NoteCategorySort.QUO2,
    sortOrder: 0,
    noteCategoryName: 'QUO',
    visible: true,
    noteCategoryShortName: 'QUO',
  },
  {
    className: 'reference-label-quotation-none',
    noteCategory: NoteCategorySort.QUONONE,
    sortOrder: 0,
    noteCategoryName: 'QUO-NONE',
    visible: true,
    noteCategoryShortName: '',
  },
  {
    className: 'reference-label-quotation-2-none',
    noteCategory: NoteCategorySort.QUO2NONE,
    sortOrder: 0,
    noteCategoryName: 'QUO-2-NONE',
    visible: true,
    noteCategoryShortName: '',
  },
  {
    className: 'reference-label-translation',
    noteCategory: NoteCategorySort.TRN,
    sortOrder: 0,
    noteCategoryName: 'TRN',
    visible: true,
    noteCategoryShortName: 'TRN',
  },
  {
    className: 'reference-label-translation-1',
    noteCategory: NoteCategorySort.TRN1,
    sortOrder: 0,
    noteCategoryName: 'TRN',
    visible: true,
    noteCategoryShortName: 'TRN',
  },
  {
    className: 'reference-label-translation-2',
    noteCategory: NoteCategorySort.TRN2,
    sortOrder: 0,
    noteCategoryName: 'TRN',
    visible: true,
    noteCategoryShortName: 'TRN',
  },
  {
    className: 'reference-label-or',
    noteCategory: NoteCategorySort.OR,
    sortOrder: 0,
    noteCategoryName: 'OR',
    visible: true,
    noteCategoryShortName: 'OR',
  },
  {
    className: 'reference-label-or-translation-1',
    noteCategory: NoteCategorySort.ORTRN1,
    sortOrder: 0,
    noteCategoryName: 'OR',
    visible: true,
    noteCategoryShortName: 'OR',
  },
  {
    className: 'reference-label-or-translation-2',
    noteCategory: NoteCategorySort.ORTRN2,
    sortOrder: 0,
    noteCategoryName: 'OR-TRN-2',
    visible: true,
    noteCategoryShortName: 'OR',
  },
];
// referenceLabelShortName: 'QUO-1',
// referenceLabelSho
// referenceLabelShortName: 'QUO-1',
// referenceLabelShortName: 'QUO-2',

export function getNoteCategoryByClassName(
  className: string,
): NoteCategory | undefined {
  return NOTE_CATEGORIES.find((refLabel): boolean => {
    return refLabel.className === className;
  });
}
export function getNoteCategoryByNoteCategory(
  noteCategory: NoteCategorySort,
): NoteCategory | undefined {
  return NOTE_CATEGORIES.find((refLabel): boolean => {
    return refLabel.noteCategory === noteCategory;
  });
}
export function getNoteCategoryBynoteCategoryName(
  noteCategoryName: string,
): NoteCategory | undefined {
  return NOTE_CATEGORIES.find((refLabel): boolean => {
    return refLabel.noteCategoryName === noteCategoryName;
  });
}

export const enum LanguageCode {
  eng,
  fra,
}

export interface Doc {
  lang: LanguageCode;
}

export function parseLanguageCode(lang: string | undefined): LanguageCode {
  switch (lang) {
    case 'eng': {
      return LanguageCode.eng;
    }
    case 'fra': {
      return LanguageCode.fra;
    }
  }
  return LanguageCode.eng;
}

export function languageCodeToString(
  languageCode: LanguageCode | undefined,
): string {
  switch (languageCode) {
    case LanguageCode.eng: {
      return 'eng';
    }
    case LanguageCode.fra: {
      return 'fra';
    }
  }
  return 'eng';
}

export class NoteProperities {
  public highlight = false;
  public visible = false;
}

export class NoteFormat {
  public _id: string;
  public noteProperities: NoteProperities;
  public uncompressedOffsets?: number[];
}
export interface CouchDoc {
  _id: string;
  _rev?: string;
}
export interface CouchDocGet {
  id: string;
  rev: string;
}
export const enum Color {
  yellow,
  blue,
  green,
  red,
  purple,
  orange,
  pink,
  gray,
  brown,
  darkBlue,
}

export const enum DisplayAs {
  CLASS,
  RICHTEXT,
  NEVER,
}

export const enum FormatTagType {
  verseNumber = 0,
  italic,
  bold,
  subordinate,
  clarityWord,
  translit,
  language,
  deityName,
  smallCaps,
  uppercase,
  entry,
  closing,
  signature,
  shortTitle,
  break,
  salutation,
  office,
  date,
  addressee,
  answer,
  question,
  Line,
  paraMark,
  selah,
  Poetry,
  Prose,
  clarityword,
  dominant,
  smallcaps,
  deityname,
  uppercasedeityname,
  UnderlineYellow,
  UnderlineBlue,
  UnderlineGreen,
  UnderlineRed,
  UnderlinePurple,
  UnderlineOrange,
  UnderlinePink,
  UnderlineGray,
  UnderlineBrown,
  UnderlineDarkBlue,
  HighlightDarkBlue,
  HighlightBrown,
  HighlightGray,
  HighlightPink,
  HighlightYellow,
  HighlightOrange,
  HighlightBlue,
  HighlightPurple,
  HighlightGreen,
  HighlightRed,
  RefSingle,
  RefMulti,
  Paragraph,
  Stanza,
  Block,
  Gap,
  ParaGap,
  LineGap,
  Plain,
  BlockGap,
  Para,
  insertion,
  deletion,
  verseNumberAll,
}

export const enum Optional {
  ALWAYS,
  NEVER,
  SOMETIMES,
}
export class FormatTagTypeOptions {
  public className: string | undefined;
  public displayAs: DisplayAs = DisplayAs.NEVER;
  public formatTagType: FormatTagType | undefined;
  public optional: Optional | undefined;
}
export interface Offsets {
  offsets?: string;
  uncompressedOffsets?: number[];
}
export interface Visibility {
  visible?: boolean;
}

export function getVisible<T extends Visibility>(items: T[]): T[] {
  return items.filter((item): boolean => {
    return item.visible === true;
  });
}

export class NoteRef implements Visibility {
  public noteCategory?: NoteCategorySort;
  public safeHtml?: any;
  public text?: string;
  public visible?: boolean;
}

// export class FormatTag {
//   public classList: string[] | undefined;
//   public displayAs: DisplayAs | undefined;
//   public formatType: FormatTagType | undefined;
//   public offsets: string | undefined;
//   public optional: Optional | undefined;
//   public refs: string[] | undefined;
//   public text: string | undefined;
//   public uncompressedOffsets: number[] | undefined;
//   public visible: boolean | undefined;
// }

export class NoteRefFormatTag {
  public highlight = false;
  public noteType: number;
  public offsets: string | undefined;
  public refs: string[];
  public secondaryNoteID: string;
  public uncompressedOffsets: number[] | undefined;
}

export class MergedFormatTags {
  public formatTags: FormatTag[] | undefined;
  public offsets: number[] = [];
  public refTags: NoteRefFormatTag[] | undefined;
  public text = '';
}

export class Note implements CouchDoc, Doc, Offsets {
  public _id: string;
  public _rev?: string;
  public classList?: string[];
  public formatTag?: FormatTag;
  public highlight?: boolean;
  public lang: LanguageCode;
  public noteMarker?: string;
  public notePhrase: string;
  notePhraseVis: boolean;
  public noteRefFormatTag?: NoteRefFormatTag;
  public noteRefs: NoteRef[];
  public noteType: number;
  public offsets?: string;
  public uncompressedOffsets?: number[];
  public verseMarker?: string;
  // public noteProperities?: NoteProperities;
  public visible?: boolean;

  public constructor(
    _id: string,
    lang: LanguageCode,
    noteType: number,
    notePhrase: string,
    noteRefs: NoteRef[],
    offsets?: string,
    verseMarker?: string,
    noteMarker?: string,
  ) {
    this._id = _id;
    this.offsets = offsets;
    this.lang = lang;
    this.noteType = noteType;
    this.notePhrase = notePhrase;
    this.noteRefs = noteRefs;
    this.verseMarker = verseMarker;
    this.noteMarker = noteMarker;
  }
}

export class VerseNote implements CouchDoc {
  public _id: string;
  public _rev?: string;
  public highlight?: boolean;
  public notes?: Note[];
  public notesProperties?: NoteFormat[];
  public verseNumber: string;
  public visible?: boolean;

  public constructor(_id: string, verseNumber: string, notes: Note[]) {
    this._id = _id;
    this.verseNumber = verseNumber;
    // this.lang = lang;
    this.notes = notes;
  }
}
export const enum FileTypes {
  verseNotes,
  breaks,
  chapter,
  topic,
  none,
  section,
  figure,
  tableOfContents,
  book,
  mapShell,
}

export function getFileType(document: Document): FileTypes {
  const html = document.querySelector('html');
  if (html) {
    const fileTypeAttr = html.getAttribute('data-content-type');

    switch (fileTypeAttr) {
      case 'overlay-note': {
        return FileTypes.verseNotes;
      }
      case 'overlay-breaks': {
        return FileTypes.breaks;
      }
      case 'chapter': {
        return FileTypes.chapter;
      }
      case 'topic': {
        return FileTypes.topic;
      }
      case 'section': {
        return FileTypes.section;
        break;
      }
      case 'figure': {
        return FileTypes.figure;
      }
      case 'table-of-contents': {
        return FileTypes.tableOfContents;
      }
      case 'book': {
        return FileTypes.book;
      }
      case 'overlay-shell': {
        return FileTypes.mapShell;
      }
      default: {
        console.log(fileTypeAttr);
      }
    }
  }

  return FileTypes.none;
}

export class VerseNotes implements CouchDoc, Doc {
  public _id: string;
  public _rev?: string;
  public fileType: FileTypes;
  public lang: LanguageCode;
  public save?: boolean;
  public verseNotes: VerseNote[];
  // public title: string;
  // public shortTitle: string;

  public constructor(
    _id: string,
    verseNotes: VerseNote[],
    lang: LanguageCode,
    fileType: FileTypes,
    // title: string,
    // shortTitle: string,
  ) {
    this._id = _id;
    this.lang = lang;
    this.verseNotes = verseNotes;
    this.fileType = fileType;
    // this.title = title;
    // this.shortTitle = shortTitle;
  }
}

export const formatTagTypeOptions: FormatTagTypeOptions[] = [
  {
    className: 'verse-number-all',
    formatTagType: FormatTagType.verseNumberAll,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'verse-number',
    formatTagType: FormatTagType.verseNumber,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.RICHTEXT,
  },
  {
    className: 'italic',
    formatTagType: FormatTagType.italic,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.RICHTEXT,
  },
  {
    className: 'bold',
    formatTagType: FormatTagType.bold,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.RICHTEXT,
  },
  {
    className: 'clarity-word',
    formatTagType: FormatTagType.clarityWord,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'translit',
    formatTagType: FormatTagType.translit,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'language',
    formatTagType: FormatTagType.language,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'deity-name',
    formatTagType: FormatTagType.deityName,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'small-caps',
    formatTagType: FormatTagType.smallCaps,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'uppercase',
    formatTagType: FormatTagType.uppercase,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'entry',
    formatTagType: FormatTagType.entry,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'insertion',
    formatTagType: FormatTagType.insertion,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'deletion',
    formatTagType: FormatTagType.deletion,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'closing',
    formatTagType: FormatTagType.closing,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'signature',
    formatTagType: FormatTagType.signature,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'short-title',
    formatTagType: FormatTagType.shortTitle,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'breakRich',
    formatTagType: FormatTagType.break,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'salutation',
    formatTagType: FormatTagType.salutation,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'office',
    formatTagType: FormatTagType.office,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'date',
    formatTagType: FormatTagType.date,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'addressee',
    formatTagType: FormatTagType.addressee,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'answer',
    formatTagType: FormatTagType.answer,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'question',
    formatTagType: FormatTagType.question,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'line',
    formatTagType: FormatTagType.Line,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'line-gap',
    formatTagType: FormatTagType.LineGap,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'poetry',
    formatTagType: FormatTagType.Poetry,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'prose',
    formatTagType: FormatTagType.Prose,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'paraMark',
    formatTagType: FormatTagType.paraMark,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER,
  },
  {
    className: 'selah',
    formatTagType: FormatTagType.selah,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'underline-Yellow',
    formatTagType: FormatTagType.UnderlineYellow,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'underline-Blue',
    formatTagType: FormatTagType.UnderlineBlue,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'underline-Green',
    formatTagType: FormatTagType.UnderlineGreen,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'underline-Red',
    formatTagType: FormatTagType.UnderlineRed,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'underline-Purple',
    formatTagType: FormatTagType.UnderlinePurple,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'underline-Orange',
    formatTagType: FormatTagType.UnderlineOrange,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'underline-Pink',
    formatTagType: FormatTagType.UnderlinePink,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'underline-Gray',
    formatTagType: FormatTagType.UnderlineGray,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'subordinate',
    formatTagType: FormatTagType.subordinate,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.CLASS,
  },

  {
    className: 'underline-Brown',
    formatTagType: FormatTagType.UnderlineBrown,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'underline-DarkBlue',
    formatTagType: FormatTagType.UnderlineDarkBlue,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'highlight-DarkBlue',
    formatTagType: FormatTagType.HighlightDarkBlue,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'highlight-Brown',
    formatTagType: FormatTagType.HighlightBrown,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'highlight-Gray',
    formatTagType: FormatTagType.HighlightGray,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'highlight-Pink',
    formatTagType: FormatTagType.HighlightPink,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'highlight-Yellow',
    formatTagType: FormatTagType.HighlightYellow,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'highlight-Orange',
    formatTagType: FormatTagType.HighlightOrange,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'highlight-Blue',
    formatTagType: FormatTagType.HighlightBlue,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'highlight-Purple',
    formatTagType: FormatTagType.HighlightPurple,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'highlight-Green',
    formatTagType: FormatTagType.HighlightGreen,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'highlight-Red',
    formatTagType: FormatTagType.HighlightRed,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'ref-single',
    formatTagType: FormatTagType.RefSingle,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'ref-multi',
    formatTagType: FormatTagType.RefMulti,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },

  {
    className: 'clarity-word',
    formatTagType: FormatTagType.clarityWord,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'dominant',
    formatTagType: FormatTagType.dominant,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'small-caps',
    formatTagType: FormatTagType.smallCaps,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'deity-name',
    formatTagType: FormatTagType.deityName,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'para',
    formatTagType: FormatTagType.Para,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'para-gap',
    formatTagType: FormatTagType.Paragraph,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'stanza',
    formatTagType: FormatTagType.Stanza,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'block',
    formatTagType: FormatTagType.Block,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'block-gap',
    formatTagType: FormatTagType.BlockGap,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'uppercase-deityname',
    formatTagType: FormatTagType.uppercasedeityname,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
  {
    className: 'plain',
    formatTagType: FormatTagType.Plain,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS,
  },
];

export const enum NodeName {
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  span,
}

export class VerseBreaks {
  public _id?: string;
  public _rev?: string;
  public breaks?: FormatGroup[];
}
export class FakeVerseBreaks {
  public _id?: string;
  public _rev?: string;
  public breaks?: FormatTag[];
}

export class Verse {
  public _id?: string;
  public _rev?: string;
  public breakFormatGroups: FormatGroup[];
  public classList?: string | undefined[];
  public context?: boolean;
  public fakeVerseBreak: FakeVerseBreaks | undefined;
  public formatGroups: FormatGroup[] = [];
  public formatTags?: FormatTag[];
  public highlight?: boolean;
  public kjvRef: string[] | undefined;
  public kjvVerse: Verse[] | undefined;
  public nodeName?: NodeName;
  public note?: VerseNote;
  public noteID: string;
  public text?: string;
  // public verseBreaks?:
  public verseBreaks?: VerseBreaks;
  public verseID?: string;
}

export class ChapterVerses {
  public _id: string;
  public _rev: string | undefined;
  public verses: Verse[] | undefined;
}

export class NoteTypeOverlay {
  public className: string;
  public name: string;
  public shortName: string;
  public sort: number;
  public visibility: boolean;
  public constructor(
    name: string,
    shortName: string,
    className: string,
    visibility: boolean,
    sort: number,
  ) {
    this.name = name;
    this.shortName = shortName;
    this.className = className;
    this.visibility = visibility;
    this.sort = sort;
  }
}

export class NoteTypes implements CouchDoc, Doc {
  public _id: string;
  public _rev?: string;
  public lang: LanguageCode;
  public noteTypes: NoteTypeOverlay[];
  public constructor(
    _id: string,
    lang: LanguageCode,
    noteTypes: NoteTypeOverlay[],
  ) {
    this._id = _id;
    this.lang = lang;
    this.noteTypes = noteTypes;
  }

  /**
   * queryNoteTypeByClassName
   */
}

export class NotePronunciation extends Note {
  public href: string;
  public pronunciation = true;
  public constructor(
    // tslint:disable-next-line:variable-name
    _id: string,
    href: string,
    lang: LanguageCode,
    noteType: number,
    notePhrase: string,
    noteRefs: NoteRef[],
    offsets?: string,
    verseMarker?: string,
    noteMarker?: string,
  ) {
    super(
      _id,
      lang,
      noteType,
      notePhrase,
      noteRefs,
      offsets,
      verseMarker,
      noteMarker,
    );
    this.href = href;
  }
}

export class NoteGeography extends Note {
  public geography = true;

  public constructor(
    // tslint:disable-next-line:variable-name
    _id: string,
    lang: LanguageCode,
    noteType: number,
    notePhrase: string,
    noteRefs: NoteRef[],
    offsets?: string,
    verseMarker?: string,
    noteMarker?: string,
  ) {
    super(
      _id,
      lang,
      noteType,
      notePhrase,
      noteRefs,
      offsets,
      verseMarker,
      noteMarker,
    );
  }
}
