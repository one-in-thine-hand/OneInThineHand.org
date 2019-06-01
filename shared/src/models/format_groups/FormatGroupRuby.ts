import { FormatGroup } from './FormatGroup';

import { FormatTag } from '../format_tags/FormatTag';
import { FormatGroupType } from '../../enums/FormatGroupType';

export class FormatGroupRuby extends FormatGroup {
  public formatGroupType = FormatGroupType.Ruby;
  public formatGroupRT: FormatGroupRT | undefined;
  public formatGroupRB: FormatGroupRB | undefined;
}
export class FormatGroupRT extends FormatGroup {
  public formatGroupType = FormatGroupType.RT;
  public formatTags: FormatTag[] | undefined;
}
export class FormatGroupRB extends FormatGroup {
  public formatGroupType = FormatGroupType.RB;
  public formatTags: FormatTag[] | undefined;
}
