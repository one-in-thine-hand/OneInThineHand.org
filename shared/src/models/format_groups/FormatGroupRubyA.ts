import { FormatGroup } from './FormatGroup';
import { FormatGroupRuby } from './FormatGroupRuby';
import { FormatGroupType } from '../../enums/FormatGroupType';

export class FormatGroupRubyA extends FormatGroup {
  public formatGroupType: FormatGroupType = FormatGroupType.ARuby;
  public formatGroupRuby: FormatGroupRuby | undefined;
}
