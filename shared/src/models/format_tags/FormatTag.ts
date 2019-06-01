import { FormatType } from '../../enums/FormatType';
import { Color } from '../../enums/Color';
import { Optional } from '../../enums/RichText';

// public compressedOffsets: [number, number];
// public offsets: string| undefined;
export abstract class FormatTag {
  public offsets: string | undefined;
  public uncompressedOffsets: [number, number][] | undefined;
  public optional: Optional | undefined;
  public formatType: FormatType | undefined;
  public text: string | undefined;
  public visible: boolean | undefined;
  public classList: string[] | undefined;
}

export class FormatTagHighlight extends FormatTag {
  public formatType = FormatType.Highlight;
  public color: Color | undefined;
  public optional: Optional | undefined;
}
export class FormatTagUnderline extends FormatTag {
  public formatType = FormatType.Underline;
  public color: Color | undefined;
  public optional: Optional | undefined;
}
export class FormatTagRichText extends FormatTag {
  public formatType = FormatType.RichText;
  public optional: Optional | undefined;
}
