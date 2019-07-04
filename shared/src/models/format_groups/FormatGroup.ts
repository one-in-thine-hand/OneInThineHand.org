import { FormatGroupType } from '../../enums/enums';

import { FormatTag, FMerged } from '../format_tags/FormatTag';

export abstract class FormatGroup {
  public formatGroupType: FormatGroupType | undefined;
  public uncompressedOffsets: number[] | undefined;
  public offsets: string | undefined;
  public classList: string[] | undefined;
  public fMerges: FMerged[] | undefined;
}

export class FormatGroupA extends FormatGroup {
  public formatGroupType = FormatGroupType.A;
  public href: string | undefined;
}

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
export class FormatGroupRubyA extends FormatGroup {
  public formatGroupType: FormatGroupType = FormatGroupType.ARuby;
  public formatGroupRuby: FormatGroupRuby | undefined;
}

export class FormatGroupText extends FormatGroup {
  public formatGroupType = FormatGroupType.Text;
}
export class FormatGroupBR extends FormatGroup {
  public formatGroupType = FormatGroupType.BR;
  public offsets = undefined;
  public classList = undefined;
}
export class FormatGroupSegment extends FormatGroup {
  public formatGroupType = FormatGroupType.Segment;
  public kjvRef: string[] | undefined;
}
export class FormatGroupPart extends FormatGroup {
  public formatGroupType = FormatGroupType.Part;
  public kjvRef: string[] | undefined;
}
export class FormatGroupPara extends FormatGroup {
  public formatGroupType = FormatGroupType.Para;
}
export class FormatGroupLine extends FormatGroup {
  public formatGroupType = FormatGroupType.Line;
}
export class FormatGroupLineGap extends FormatGroup {
  public formatGroupType = FormatGroupType.LineGap;
}
export class FormatGroupParaGap extends FormatGroup {
  public formatGroupType = FormatGroupType.ParaGap;
}
export class FormatGroupBlock extends FormatGroup {
  public formatGroupType = FormatGroupType.Block;
}
export class FormatGroupBlockGap extends FormatGroup {
  public formatGroupType = FormatGroupType.BlockGap;
}
export class FormatGroupPageBreak extends FormatGroup {
  public formatGroupType = FormatGroupType.BR;
  public offsets = undefined;
  public classList = ['page-break'];
}
