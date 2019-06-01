import { FormatGroupType } from '../../enums/FormatGroupType';

export abstract class FormatGroup {
  public formatGroupType: FormatGroupType | undefined;
  public uncompressedOffsets: [number, number][] | undefined;
  public offsets: string | undefined;
  public classList: string[] | undefined;
}
