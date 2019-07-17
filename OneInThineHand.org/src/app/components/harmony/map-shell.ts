import { Verse } from '../../models/verse-notes';

export interface VerseRef {
  id: string;
}

export class VerseReference implements VerseRef {
  public id: string;

  public constructor(id: string) {
    this.id = id;
  }
}

export class KJVVerseRef implements VerseRef {
  public id: string;
  public kjvRef?: string;
  public constructor(id: string, kjvRef?: string) {
    this.id = id;
    if (id && kjvRef) {
      const bookNameSplit = id.split('-');
      this.kjvRef = `${bookNameSplit[0]}-${bookNameSplit[1]}-${kjvRef.replace(
        ':',
        '-',
      )}`;
    }
  }
}

export class MapShellColumn {
  public sortKey?: string | null;
  public verseRefs: VerseRef[];
  public verses?: Verse[];

  public constructor(verseRefs: VerseRef[], sortKey?: string | null) {
    this.verseRefs = verseRefs;
    this.sortKey = sortKey;
  }
}

export class MapShellRow {
  public mapShellColumns: MapShellColumn[];

  public constructor(mapShellColumns: MapShellColumn[]) {
    this.mapShellColumns = mapShellColumns;
  }
}

export class MapShell {
  public _id: string;
  public databaseIDS: string[];
  public headerHtml?: string;
  public mapShellRows: MapShellRow[];

  public constructor(
    _id: string,
    mapShellRows: MapShellRow[],
    headerHtml?: string,
  ) {
    this._id = _id;
    this.mapShellRows = mapShellRows;
    this.headerHtml = headerHtml;
  }
}
