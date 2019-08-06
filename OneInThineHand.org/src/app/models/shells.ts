import {
  CouchDoc,
  Doc,
  LanguageCode,
  FileTypes,
  VerseNotes,
  VerseNote,
  Verse,
} from './verse-notes';
import { Chapter } from '../../../../chapter/src/Chapter';
import { ChapterParams } from '../services/param.service';
import { filterUndefined } from '../../../../shared/src/shared';

// tslint:disable:max-classes-per-file
// tslint:disable:completed-docs
export const enum ColumnType {
  Verse,
  Summary,
}
export class Ref {
  public id: string;
}

export class DividerItem implements CouchDoc, Doc {
  public lang: LanguageCode;
  public fileType: FileTypes;
  public _id: string;
  public _rev?: string | undefined;
  public src: string;
  public alt: string;
  public width: string;
}

export class ShellColumn {
  public items?: (CouchDoc & Doc)[];
  public columnType: ColumnType;
  public constructor(columnType: ColumnType) {
    this.columnType = columnType;
  }
}
export class SummaryItem implements CouchDoc, Doc {
  public _id: string;
  public _rev?: string | undefined;
  public lang: LanguageCode;
  public text: string;
  public constructor(text: string, _id: string) {
    this.text = text;
    this._id = _id;
  }
}

export class ShellColumnSummary extends ShellColumn {
  public items: SummaryItem[];
  public constructor(items: SummaryItem[]) {
    super(ColumnType.Summary);
    this.items = items;
  }
}
export class ShellColumnDivider extends ShellColumn {
  public constructor(items: DividerItem[]) {
    super(ColumnType.Summary);
    this.items = items;
  }
}

export class ShellColumnVerse extends ShellColumn {
  public sortKey?: string | null;
  public refs: Ref[];

  public constructor(verseRefs: Ref[], sortKey?: string | null) {
    super(ColumnType.Verse);
    this.refs = verseRefs;
    this.sortKey = sortKey;
  }
}

export class ShellRow {
  public cols: ShellColumn[];

  public constructor(mapShellColumns: ShellColumn[]) {
    this.cols = mapShellColumns;
  }
}

export const enum ShellType {
  ldsSourceMaster,
  language,
  master,
}
// tslint:disable-next-line:max-classes-per-file
export class Shell implements CouchDoc {
  public _id: string;
  public name: string;
  public verseRows: ShellRow[];
  public verseNoteRows: ShellRow[];
  public docIDs: string[];
  public shellType: ShellType;
  public _rev?: string;
  public chapters?: Chapter[];
  public verseNotes?: VerseNotes[];
  public flatVerseNotes?: VerseNote[];
  public databaseIDS: string[];
  public flatVerses?: Verse[];
  public chapterParams: ChapterParams;
  public constructor(
    docIDs: string[],
    name: string,
    _id: string,
    rows: ShellRow[],
  ) {
    this.docIDs = docIDs;
    this._id = _id;
    this.name = name;
    this.verseRows = rows;
    // this.verseNoteRows = this.generateVerseNotesRow(this.verseRows);
  }

  private generateVerseNotesRow(verseRows: ShellRow[]): ShellRow[] {
    return verseRows.map(
      (verseRow): ShellRow => {
        return new ShellRow(
          filterUndefined(
            verseRow.cols.map((verseCol): ShellColumnVerse | undefined => {
              const col = verseCol as ShellColumnVerse;
              if (col.refs) {
                const refs = col.refs.map(
                  (ref): Ref => {
                    return { id: ref.id.replace('verse', 'verse-notes') };
                  },
                );

                return new ShellColumnVerse(refs, col.sortKey);
              }

              return undefined;
            }),
          ),
        );
      },
    );
    // return verseRows
  }
}
// export class MasterShell<T extends CouchDoc & Doc> implements CouchDoc {
//   public _id: string;
//   public name: string;
//   public verseRows: MapShellRow<T>[];
//   public verseNoteRows: MapShellRow<VerseNote>[];
//   public docIDs: string[];
//   public shellType: MapShellType;
//   public _rev?: string;
//   public chapters?: Chapter[];
//   public verseNotes?: VerseNotes[];
//   public flatVerseNotes?: VerseNote[];
//   public databaseIDS: string[];
//   public flatVerses?: Verse[];
//   public chapterParams: ChapterParams;
//   public constructor(
//     docIDs: string[],
//     name: string,
//     _id: string,
//     rows: MapShellRow<T>[],
//     shellType: MapShellType,
//   ) {
//     this.docIDs = docIDs;
//     this._id = _id;
//     this.name = name;
//     this.shellType = shellType;
//     this.verseRows = rows;
//     this.verseNoteRows = this.generateVerseNotesRow(this.verseRows);
//   }

//   private generateVerseNotesRow(
//     verseRows: MapShellRow<Verse>[],
//   ): MapShellRow<VerseNote>[] {
//     return verseRows.map(
//       (verseRow): MapShellRow<VerseNote> => {
//         return new MapShellRow<VerseNote>(
//           verseRow.cols.map(
//             (verseCol): MapShellColumnVerse<VerseNote> => {
//               const refs = verseCol.refs.map(
//                 (ref): Ref => {
//                   return { id: ref.id.replace('verse', 'verse-notes') };
//                 },
//               );

//               return new MapShellColumnVerse(refs, verseCol.sortKey);
//             },
//           ),
//         );
//       },
//     );
//     // return verseRows
//   }
// }
//MasterShell
