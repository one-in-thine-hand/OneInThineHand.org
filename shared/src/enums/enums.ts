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
  darkBlue
}

export const enum Environment {
  browser,
  node
}
// export const ColorEnum = Color;
export const enum FormatGroupType {
  A = 0,
  Text = 1,
  Ruby = 2,
  ARuby = 3,
  RB = 4,
  RT = 5,
  SPAN = 6,
  BR = 7,
  PAGE_BREAK = 8
}
// export const enum FormatType {
//   Base = 0,
//   RichText = 1,
//   Highlight = 2,
//   Underline = 3,
//   Refs = 4,
//   Poetry = 5,
//   Link = 6,
//   Temp = -1
//   // UnderlineYellow,
//   // UnderlineBlue,
//   // UnderlineGreen,
//   // UnderlineRed,
//   // UnderlinePurple,
//   // UnderlineOrange,
//   // UnderlinePink,
//   // UnderlineGray,
//   // UnderlineBrown,
//   // UnderlineDarkBlue,

//   // HighlightDarkBlue,
//   // HighlightBrown,
//   // HighlightGray,
//   // HighlightPink,
//   // HighlightYellow,
//   // HighlightOrange,
//   // HighlightBlue,
//   // HighlightPurple,
//   // HighlightGreen,
//   // HighlightRed
// }

const enum DisplayAs {
  CLASS,
  RICHTEXT,
  NEVER
}
export const enum Poetry {}
export const enum FormatTagType {
  verseNumber = 0,
  italic,
  bold,
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
  line,
  paraMark,
  selah,
  Poetry,
  Prose,
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
  RefMulti
}

export const enum Optional {
  ALWAYS,
  NEVER,
  SOMETIMES
}
export class RichText {
  public formatTagType: FormatTagType | undefined;
  public optional: Optional | undefined;
  public className: string | undefined;
  public displayAs: DisplayAs = DisplayAs.NEVER;
}
export const gg: RichText[] = [
  {
    className: 'verse-number',
    formatTagType: FormatTagType.verseNumber,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.RICHTEXT
  },
  {
    className: 'italic',
    formatTagType: FormatTagType.italic,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.RICHTEXT
  },
  {
    className: 'bold',
    formatTagType: FormatTagType.bold,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.RICHTEXT
  },
  {
    className: 'clarityWord',
    formatTagType: FormatTagType.clarityWord,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'translit',
    formatTagType: FormatTagType.translit,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'language',
    formatTagType: FormatTagType.language,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'deityName',
    formatTagType: FormatTagType.deityName,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'smallCaps',
    formatTagType: FormatTagType.smallCaps,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'uppercase',
    formatTagType: FormatTagType.uppercase,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'entry',
    formatTagType: FormatTagType.entry,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'closing',
    formatTagType: FormatTagType.closing,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'signature',
    formatTagType: FormatTagType.signature,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'shortTitle',
    formatTagType: FormatTagType.shortTitle,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'breakRich',
    formatTagType: FormatTagType.break,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'salutation',
    formatTagType: FormatTagType.salutation,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'office',
    formatTagType: FormatTagType.office,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'date',
    formatTagType: FormatTagType.date,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'addressee',
    formatTagType: FormatTagType.addressee,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'answer',
    formatTagType: FormatTagType.answer,
    optional: Optional.ALWAYS,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'question',
    formatTagType: FormatTagType.question,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'line',
    formatTagType: FormatTagType.line,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'poetry',
    formatTagType: FormatTagType.Poetry,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'prose',
    formatTagType: FormatTagType.Prose,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'paraMark',
    formatTagType: FormatTagType.paraMark,
    optional: Optional.NEVER,
    displayAs: DisplayAs.NEVER
  },
  {
    className: 'selah',
    formatTagType: FormatTagType.selah,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'underline-Yellow',
    formatTagType: FormatTagType.UnderlineYellow,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'underline-Blue',
    formatTagType: FormatTagType.UnderlineBlue,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'underline-Green',
    formatTagType: FormatTagType.UnderlineGreen,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'underline-Red',
    formatTagType: FormatTagType.UnderlineRed,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'underline-Purple',
    formatTagType: FormatTagType.UnderlinePurple,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'underline-Orange',
    formatTagType: FormatTagType.UnderlineOrange,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'underline-Pink',
    formatTagType: FormatTagType.UnderlinePink,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'underline-Gray',
    formatTagType: FormatTagType.UnderlineGray,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'underline-Brown',
    formatTagType: FormatTagType.UnderlineBrown,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'underline-DarkBlue',
    formatTagType: FormatTagType.UnderlineDarkBlue,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'highlight-DarkBlue',
    formatTagType: FormatTagType.HighlightDarkBlue,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'highlight-Brown',
    formatTagType: FormatTagType.HighlightBrown,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'highlight-Gray',
    formatTagType: FormatTagType.HighlightGray,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'highlight-Pink',
    formatTagType: FormatTagType.HighlightPink,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'highlight-Yellow',
    formatTagType: FormatTagType.HighlightYellow,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'highlight-Orange',
    formatTagType: FormatTagType.HighlightOrange,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'highlight-Blue',
    formatTagType: FormatTagType.HighlightBlue,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'highlight-Purple',
    formatTagType: FormatTagType.HighlightPurple,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'highlight-Green',
    formatTagType: FormatTagType.HighlightGreen,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'highlight-Red',
    formatTagType: FormatTagType.HighlightRed,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'ref-single',
    formatTagType: FormatTagType.RefSingle,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  },
  {
    className: 'ref-multi',
    formatTagType: FormatTagType.RefMulti,
    optional: Optional.SOMETIMES,
    displayAs: DisplayAs.CLASS
  }
];
