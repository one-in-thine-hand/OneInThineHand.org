import { FormatGroup } from './FormatGroup';
import { FormatGroupType } from '../../enums/FormatGroupType';

export class FormatGroupText extends FormatGroup {
  public formatGroupType = FormatGroupType.Text;
}
export class FormatGroupBR extends FormatGroup {
  public formatGroupType = FormatGroupType.BR;
  public offsets = undefined;
  public classList = undefined;
}
export class FormatGroupPageBreak extends FormatGroup {
  public formatGroupType = FormatGroupType.BR;
  public offsets = undefined;
  public classList = ['page-break'];
}
