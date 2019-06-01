export const enum RichTextType {
  verseNumber = 0,
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
  selah
}

export const enum Optional {
  ALWAYS,
  NEVER,
  SOMETIMES
}
export class RichText {
  public richTextType: RichTextType | undefined;
  public optional: Optional | undefined;
}

export const verseNumber: RichText = {
  richTextType: RichTextType.verseNumber,
  optional: Optional.ALWAYS
};
export const clarityWord: RichText = {
  richTextType: RichTextType.clarityWord,
  optional: Optional.SOMETIMES
};
export const translit: RichText = {
  richTextType: RichTextType.translit,
  optional: Optional.NEVER
};
export const language: RichText = {
  richTextType: RichTextType.language,
  optional: Optional.NEVER
};
export const deityName: RichText = {
  richTextType: RichTextType.deityName,
  optional: Optional.NEVER
};
export const smallCaps: RichText = {
  richTextType: RichTextType.smallCaps,
  optional: Optional.SOMETIMES
};
export const uppercase: RichText = {
  richTextType: RichTextType.uppercase,
  optional: Optional.SOMETIMES
};
export const entry: RichText = {
  richTextType: RichTextType.entry,
  optional: Optional.NEVER
};
export const closing: RichText = {
  richTextType: RichTextType.closing,
  optional: Optional.ALWAYS
};
export const signature: RichText = {
  richTextType: RichTextType.signature,
  optional: Optional.ALWAYS
};
export const shortTitle: RichText = {
  richTextType: RichTextType.shortTitle,
  optional: Optional.NEVER
};
export const breakRich: RichText = {
  richTextType: RichTextType.break,
  optional: Optional.ALWAYS
};
export const salutation: RichText = {
  richTextType: RichTextType.salutation,
  optional: Optional.NEVER
};
export const office: RichText = {
  richTextType: RichTextType.office,
  optional: Optional.NEVER
};
export const date: RichText = {
  richTextType: RichTextType.date,
  optional: Optional.NEVER
};
export const addressee: RichText = {
  richTextType: RichTextType.addressee,
  optional: Optional.ALWAYS
};
export const answer: RichText = {
  richTextType: RichTextType.answer,
  optional: Optional.ALWAYS
};
export const question: RichText = {
  richTextType: RichTextType.question,
  optional: Optional.NEVER
};
export const line: RichText = {
  richTextType: RichTextType.line,
  optional: Optional.SOMETIMES
};
export const paraMark: RichText = {
  richTextType: RichTextType.paraMark,
  optional: Optional.NEVER
};
export const selah: RichText = {
  richTextType: RichTextType.selah,
  optional: Optional.SOMETIMES
};
