import { Paragraph } from './Paragraph';
import { Verse, NoteRef, Note } from '../../shared/src/shared';

export class Chapter {
  public _id: string;
  public _rev: string | undefined;
  public paragraphs: Paragraph[] | undefined;
  public dataAid: string | undefined;
  public language: string;
  public notesIDs: string[] | undefined;
  public shortTitle: string;
  public testament: string;
  public title: string;
  public versesFileID: string;
  public notesFileID: string;
  public verses: Verse[] | undefined;
  public notes: Note[] | undefined;
  public nextPage: string | null;
  public previousPage: string | null;
  public noteRefs: NoteRef[] = [];
}
