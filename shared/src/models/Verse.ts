import { FormatGroup } from './format_groups/FormatGroup';
import { FormatTag } from './format_tags/FormatTag';
import { Note } from './notes/Note';
// import { NoteLDSSource } from '../../../oith.notes/src/models/Note'
export const enum NodeName {
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  span,
}

export class Verse {
  public _id: string | undefined;
  public _rev: string | undefined;
  public verseID: string | undefined;
  public formatGroups: FormatGroup[] = [];
  public classList: string | undefined[] | undefined;
  public text: string | undefined;
  public formatTags: FormatTag[] | undefined;
  public nodeName: NodeName | undefined;
  public note: Note | undefined;
}
