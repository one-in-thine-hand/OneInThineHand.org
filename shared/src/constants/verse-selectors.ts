import {
  FormatTagType,
  DisplayAs,
  FormatTagTypeOptions,
  Optional
} from '../shared';

export const verseSelectors: string[] = [
  'p.verse',
  'header > *',
  '.hidden-paragraph > .verse',
  '.body-block > p',
  'nav > ul > li > *',
  '.body-block > div > *',
  '.body-block .verse'
];

export const formatTagTypeOptions: FormatTagTypeOptions[] = [
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
