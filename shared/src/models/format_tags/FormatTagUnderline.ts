import { Optional, FormatType, Color } from '../../enums/enums';
import { FormatTag } from './FormatTag';
export class FormatTagUnderline extends FormatTag {
  public formatType = FormatType.Underline;
  public color: Color | undefined;
  public optional: Optional | undefined;
}
