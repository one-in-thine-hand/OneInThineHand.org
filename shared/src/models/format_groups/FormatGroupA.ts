import { FormatGroup } from './FormatGroup';
import { FormatGroupType } from '../../enums/FormatGroupType';

export class FormatGroupA extends FormatGroup {
  public formatGroupType = FormatGroupType.A;
  public href: string | undefined;
}
