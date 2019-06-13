import { Optional, FormatTagType, DisplayAs } from '../../enums/enums';
// public compressedOffsets: [number, number];
// public offsets: string| undefined;
export class FormatTag {
  public offsets: string | undefined;
  public uncompressedOffsets: number[] | undefined;
  public optional: Optional | undefined;
  public formatType: FormatTagType | undefined;
  public text: string | undefined;
  public visible: boolean | undefined;
  public classList: string[] | undefined;
  public refs: string[] | undefined;
  public displayAs: DisplayAs | undefined;
}

export class RefTag {
  public refs: string[];
  public uncompressedOffsets: number[] | undefined;
  public offsets: string | undefined;
  public highlight = false;
}

export class FMerged {
  public formatTags: FormatTag[] | undefined;
  public text: string = '';
  public offsets: number[] = [];
  public refTags: RefTag[] | undefined;
}

// export class FormatTagHighlight extends FormatTag {
//   public formatType = FormatType.Highlight;
//   public color: Color | undefined;
//   public optional: Optional | undefined;
// }
// export class FormatTagUnderline extends FormatTag {
//   public formatType = FormatType.Underline;
//   public color: Color | undefined;
//   public optional: Optional | undefined;
// }
// export class FormatTagRichText extends FormatTag {
//   public formatType = FormatType.RichText;
//   public optional: Optional | undefined;
// }
