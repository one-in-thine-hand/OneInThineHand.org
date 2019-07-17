import { Component, OnInit, Input, HostListener } from '@angular/core';
import { getRanges, VerseNotes } from '../../../../../shared/src/shared';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { OffsetService } from '../../services/offset.service';
import { ChapterService } from '../../services/chapter.service';
import { FormatTagService } from '../../services/format-tag.service';
import { SaveService } from '../../services/save.service';
import { TempSettingsService } from '../../services/temp-settings.service';
import { Router } from '@angular/router';
import {
  Note,
  NoteRef,
  getNoteCategoryByNoteCategory,
  NoteCategorySort,
  NOTE_CATEGORIES,
  getVisible,
} from '../../models/verse-notes';

@Component({
  selector: 'app-n',
  templateUrl: './n.component.html',
  styleUrls: ['./n.component.scss'],
})
export class NComponent implements OnInit {
  public edit = false;
  @Input() public note: Note;
  @Input() public verseNotes: VerseNotes;
  public constructor(
    public domSanitizer: DomSanitizer,
    public offsetService: OffsetService,
    public chapterService: ChapterService,
    public formatTagService: FormatTagService,
    public tempSettingsService: TempSettingsService,
    public saveService: SaveService,
    public router: Router,
  ) {}

  /**
   * convertNoteCategory
   */
  public convertNoteCategory(noteRef: NoteRef): string {
    if (
      noteRef.noteCategory &&
      noteRef.noteCategory === NoteCategorySort.NONE
    ) {
      return '';
    }
    const nc = NOTE_CATEGORIES.find((rl): boolean => {
      return rl.noteCategory === noteRef.noteCategory;
    });

    return nc ? nc.noteCategoryShortName : 'extERR';
  }

  public getNotePhrase(notePhrase: string | undefined): string {
    return notePhrase && notePhrase ? notePhrase : 'Note Phrase Missing';
  }
  public getNoteRefs(secondaryNote: Note): NoteRef[] {
    return getVisible(secondaryNote.noteRefs);
  }

  public getNoteRefText(noteRef: NoteRef): SafeHtml {
    return noteRef.safeHtml;
  }
  public getRefClass(noteRef: NoteRef): string {
    if (noteRef && noteRef.noteCategory) {
      const nC = getNoteCategoryByNoteCategory(noteRef.noteCategory);
      return nC ? nC.className : '';
    }
    return '';
  }
  public getVerseNotes(): VerseNotes {
    if (this.verseNotes) {
    }
    return this.verseNotes;
  }
  public highlight(note: Note): boolean {
    return (
      note.noteRefFormatTag !== undefined && note.noteRefFormatTag.highlight
    );
  }

  public ngOnInit(): void {
    // console.log('oiajsdfoiajsdfoiajsdfo');

    if (this.note && this.note.noteRefs) {
      this.note.noteRefs.map((noteRef): void => {
        if (noteRef.text) {
          noteRef.safeHtml = this.domSanitizer.bypassSecurityTrustHtml(
            noteRef.text,
          );
        }
      });
    }
  }
  public async offsetsInput(event: Event, note: Note): Promise<void> {
    if (event.type === 'input' && event.target) {
      note.offsets = (event.target as HTMLTextAreaElement).value;

      await this.offsetService.expandNotes(this.chapterService.notes);
      await this.formatTagService.resetFormatTags(
        this.chapterService.chapterVerses,
        this.chapterService.chapterNotes,
      );

      if (note.uncompressedOffsets) {
        note.offsets = getRanges(note.uncompressedOffsets)
          .map((offsets): string => {
            return offsets.join('-');
          })
          .join(',');
      }
      await this.saveService.save();
    }
  }
}
