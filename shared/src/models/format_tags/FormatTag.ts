import { Optional, FormatTagType } from '../../enums/enums';
// public compressedOffsets: [number, number];
// public offsets: string| undefined;
export abstract class FormatTag {
  public offsets: string | undefined;
  public uncompressedOffsets: number[] | undefined;
  public optional: Optional | undefined;
  public formatType: FormatTagType | undefined;
  public text: string | undefined;
  public visible: boolean | undefined;
  public classList: string[] | undefined;
  public refs: string[] | undefined;
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
