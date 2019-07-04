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

export const enum Environment {
  browser,
  node,
}
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
// export const ColorEnum = Color;
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
  PAGE_BREAK = 8,
  Part,
  Segment,
  Line,
  LineGap,
  Block,
  Note,
  Para,
  LineGap,
  ParaGap,
  BlockGap,
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

export const enum DisplayAs {
  CLASS,
  RICHTEXT,
  NEVER,
}
export const enum Poetry {}

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
}

export const enum Optional {
  ALWAYS,
  NEVER,
  SOMETIMES,
}
export class FormatTagTypeOptions {
  public formatTagType: FormatTagType | undefined;
  public optional: Optional | undefined;
  public className: string | undefined;
  public displayAs: DisplayAs = DisplayAs.NEVER;
}
