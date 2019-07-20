import { Chapter } from '../../../../chapter/src/Chapter';
import { VerseNotes, ChapterVerses } from '../models/verse-notes';
import { OffsetGroup, VerseNoteOffsetGroup } from './offset-groups.service';

export class PageState {
  public _id: string;
  public _rev: string | undefined;
  public chapter: Chapter;
  public chapterGridScrollTop: number;
  public chapterNotes: VerseNotes;
  public chapterVerses: ChapterVerses;
  public notesScrollTop: number;
  public offsetGroups: VerseNoteOffsetGroup[];
}
