import { FormatGroup } from './format_groups/FormatGroup';
import { FormatTag } from './format_tags/FormatTag';
import { VerseNotes } from './notes/Note';
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

export class VerseBreaks {
  public _id?: string;
  public _rev?: string;
  public breaks?: FormatGroup[];
}
export class FakeVerseBreaks {
  public _id?: string;
  public _rev?: string;
  public breaks?: FormatTag[];
}

export class Verse {
  public noteID: string;
  public _id?: string;
  public _rev?: string;
  public verseID?: string;
  public formatGroups: FormatGroup[] = [];
  public classList?: string | undefined[];
  public text?: string;
  public formatTags?: FormatTag[];
  public nodeName?: NodeName;
  public note?: VerseNotes;
  public context?: boolean;
  public highlight?: boolean;
  // public verseBreaks?:
  public verseBreaks?: VerseBreaks;
  public kjvRef: string[] | undefined;
  public fakeVerseBreak: FakeVerseBreaks | undefined;
  public kjvVerse: Verse[] | undefined;
  public breakFormatGroups: FormatGroup[];
}
