import { ChapterNotes } from '../../../../notes/src/main';
import { Chapter } from '../../../../chapter/src/Chapter';
import { ChapterVerses } from '../../../../format-tags/src/main';
export class PageState {
  public _id: string;
  public _rev: string | undefined;
  public chapterNotes: ChapterNotes;
  public chapter: Chapter;
  public chapterVerses: ChapterVerses;
  public chapterGridScrollTop: number;
  public notesScrollTop: number;
}
