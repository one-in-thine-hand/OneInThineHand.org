export const enum NoteCategoryOverlay {} // tslint:disable:completed-docs
export const enum NoteCategorySort {
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
  ORT1,
  ORT2,
  IEQUO,
  IEQUO1,
  IEQUO2,
  NONE,
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
    sortOrder: 0,
    className: 'reference-label-alt',
    noteCategory: NoteCategorySort.ALT,
    noteCategoryName: 'Alternative Reading',
    visible: true,
    noteCategoryShortName: 'ALT',
  },
  {
    sortOrder: 0,
    className: 'reference-label-bd',
    noteCategory: NoteCategorySort.BD,
    noteCategoryName: 'Bible Dictionary',
    visible: true,
    noteCategoryShortName: 'BD',
  },
  {
    sortOrder: 0,
    className: 'reference-label-cross-ref',
    noteCategory: NoteCategorySort.CR,
    noteCategoryName: 'Cross Reference',
    visible: true,
    noteCategoryShortName: 'CR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-error',
    noteCategory: NoteCategorySort.ERR,
    noteCategoryName: 'ERROR',
    visible: true,
    noteCategoryShortName: 'ERROR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-geography',
    noteCategory: NoteCategorySort.GEO,
    noteCategoryName: 'Geography',
    visible: true,
    noteCategoryShortName: 'GEO',
  },
  {
    sortOrder: 0,
    className: 'reference-label-greek',
    noteCategory: NoteCategorySort.GR,
    noteCategoryName: 'Greek',
    visible: true,
    noteCategoryShortName: 'GR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-gs',
    noteCategory: NoteCategorySort.GS,
    noteCategoryName: 'Guide to the Scriptures',
    visible: true,
    noteCategoryShortName: 'GS',
  },
  {
    sortOrder: 0,
    className: 'reference-label-harmony',
    noteCategory: NoteCategorySort.HMY,
    noteCategoryName: 'Harmony',
    visible: true,
    noteCategoryShortName: 'HMY',
  },
  {
    sortOrder: 0,
    className: 'reference-label-hebrew',
    noteCategory: NoteCategorySort.HEB,
    noteCategoryName: 'Hebrew',
    visible: true,
    noteCategoryShortName: 'HEB',
  },
  {
    sortOrder: 0,
    className: 'reference-label-history',
    noteCategory: NoteCategorySort.HST,
    noteCategoryName: 'History',
    visible: true,
    noteCategoryShortName: 'HST',
  },
  {
    sortOrder: 0,
    className: 'reference-label-ie',
    noteCategory: NoteCategorySort.IE,
    noteCategoryName: 'IE',
    visible: true,
    noteCategoryShortName: 'IE',
  },
  {
    sortOrder: 0,
    className: 'reference-label-or',
    noteCategory: NoteCategorySort.OR,
    noteCategoryName: 'OR',
    visible: true,
    noteCategoryShortName: 'OR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-or-1',
    noteCategory: NoteCategorySort.OR1,
    noteCategoryName: 'OR 1',
    visible: true,
    noteCategoryShortName: 'OR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-or-2',
    noteCategory: NoteCategorySort.OR2,
    noteCategoryName: 'OR 2',
    visible: true,
    noteCategoryShortName: 'OR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-or-translation-2',
    noteCategory: NoteCategorySort.ORT2,
    noteCategoryName: 'OR TRN 2',
    visible: true,
    noteCategoryShortName: 'OR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-or-translation-1',
    noteCategory: NoteCategorySort.ORT1,
    noteCategoryName: 'OR TRN 1',
    visible: true,
    noteCategoryShortName: 'OR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-phrasing',
    noteCategory: NoteCategorySort.PHR,
    noteCategoryName: 'Phrase',
    visible: true,
    noteCategoryShortName: 'PHR',
  },
  {
    sortOrder: 0,
    className: 'reference-label-quotation',
    noteCategory: NoteCategorySort.QUO,
    noteCategoryName: 'Quotation',
    visible: true,
    noteCategoryShortName: 'QUO',
  },
  {
    sortOrder: 0,
    className: 'reference-label-ie-quotation',
    noteCategory: NoteCategorySort.IEQUO,
    noteCategoryName: 'IE Quotation',
    visible: true,
    noteCategoryShortName: 'IE',
  },
  {
    sortOrder: 0,
    className: 'reference-label-ie-quotation-1',
    noteCategory: NoteCategorySort.IEQUO1,
    noteCategoryName: 'IE Quotation 1',
    visible: true,
    noteCategoryShortName: 'IE',
  },
  {
    sortOrder: 0,
    className: 'reference-label-ie-quotation-2',
    noteCategory: NoteCategorySort.IEQUO2,
    noteCategoryName: 'IE Quotation 2',
    visible: true,
    noteCategoryShortName: 'IE',
  },
  {
    sortOrder: 0,
    className: 'reference-label-none',
    noteCategory: NoteCategorySort.NONE,
    noteCategoryName: '',
    visible: true,
    noteCategoryShortName: '',
  },
  {
    sortOrder: 0,
    className: 'reference-label-quotation-1',
    noteCategory: NoteCategorySort.QUO1,
    noteCategoryName: 'Quotation 1',
    visible: true,
    noteCategoryShortName: 'QUO',
  },
  {
    sortOrder: 0,
    className: 'reference-label-quotation-2',
    noteCategory: NoteCategorySort.QUO2,
    noteCategoryName: 'Quotation 2',
    visible: true,
    noteCategoryShortName: 'QUO',
  },
  {
    sortOrder: 0,
    className: 'reference-label-tg',
    noteCategory: NoteCategorySort.TG,
    noteCategoryName: 'Topical Guide',
    visible: true,
    noteCategoryShortName: 'TG',
  },
  {
    sortOrder: 0,
    className: 'reference-label-translation',
    noteCategory: NoteCategorySort.TRN,
    noteCategoryName: 'Translation',
    visible: true,
    noteCategoryShortName: 'TRN',
  },
  {
    sortOrder: 0,
    className: 'reference-label-translation-1',
    noteCategory: NoteCategorySort.TRN1,
    noteCategoryName: 'Translation 1',
    visible: true,
    noteCategoryShortName: 'TRN',
  },
  {
    sortOrder: 0,
    className: 'reference-label-translation-2',
    noteCategory: NoteCategorySort.TRN2,
    noteCategoryName: 'Translation 2',
    visible: true,
    noteCategoryShortName: 'TRN',
  },
];
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
export function getNoteCategoryByReferenceLabelShortName(
  referenceLabelShortName: string,
): NoteCategory | undefined {
  return NOTE_CATEGORIES.find((refLabel): boolean => {
    return refLabel.noteCategoryShortName === referenceLabelShortName;
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

export class NoteRefFormatTag {
  public highlight = false;
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
  public lang: LanguageCode;
  public noteMarker?: string;
  public notePhrase: string;
  public noteProperities?: NoteProperities;
  public noteRefFormatTag?: NoteRefFormatTag;
  public noteRefs: NoteRef[];
  public noteType: number;
  public offsets?: string;
  public uncompressedOffsets?: number[];
  public verseMarker?: string;

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
  public notes?: Note[];
  public notesProperties?: NoteFormat[];
  public verseNumber: string;

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
