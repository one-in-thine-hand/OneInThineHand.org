import { Optional, FormatTagType, Color } from '../../enums/enums';
import { FormatTag } from './FormatTag';
export class FormatTagUnderline extends FormatTag {
  public formatType = FormatTagType.UnderlineRed;
  public color: Color | undefined;
  public optional: Optional | undefined;
}
