import {
  Component,
  OnInit,
  Input,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { getRanges, VerseNotes } from '../../../../../shared/src/shared';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { OffsetService } from '../../services/offset.service';
import { ChapterService } from '../../services/chapter.service';
import { FormatTagService } from '../../services/format-tag.service';
import { SaveService } from '../../services/save.service';
import { TempSettingsService } from '../../services/temp-settings.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import {
  Note,
  NoteRef,
  NoteCategorySort,
  getVisible,
  NoteCategory,
} from '../../models/verse-notes';
import { SaveStateService } from '../../services/save-state.service';
import { Observable, Subject } from 'rxjs';
import { findByAttribute } from '../../../../../shared/src/functions/filterUndefined';
@Component({
  selector: 'app-n',
  templateUrl: './n.component.html',
  styleUrls: ['./n.component.scss'],
})
export class NComponent implements OnInit, OnDestroy {
  public edit = false;
  @Input() public note: Note;
  public testObservable = new Subject<[string, Note]>();
  @Input() public verseNotes: VerseNotes;

  public constructor(
    public domSanitizer: DomSanitizer,
    public offsetService: OffsetService,
    public chapterService: ChapterService,
    public formatTagService: FormatTagService,
    public tempSettingsService: TempSettingsService,
    public saveService: SaveService,
    public saveStateService: SaveStateService,
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
    try {
      const nc = findByAttribute(
        this.saveStateService.data.noteCategories.noteCategories,
        'noteCategory',
        noteRef.noteCategory,
      );

      return nc ? nc.label : 'extERR';
    } catch (error) {
      return 'extERR';
    }
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
    if (
      noteRef &&
      noteRef.noteCategory &&
      this.saveStateService.data.noteCategories.noteCategories
    ) {
      const nC = findByAttribute(
        this.saveStateService.data.noteCategories.noteCategories,
        'noteCategory',
        noteRef.noteCategory,
      );
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
  public ngOnDestroy(): void {
    this.testObservable.unsubscribe();
  }

  public ngOnInit(): void {
    // console.log('oiajsdfoiajsdfoiajsdfo');

    this.testObservable.pipe(debounceTime(300)).subscribe(
      async (tesr): Promise<void> => {
        this.note.offsets = tesr[0];

        await this.offsetService.expandNotes(this.chapterService.notes);
        await this.formatTagService.resetFormatTags(
          this.chapterService.chapterVerses,
          this.chapterService.chapterNotes,
        );

        if (this.note.uncompressedOffsets) {
          this.note.offsets = getRanges(this.note.uncompressedOffsets)
            .map((offsets): string => {
              return offsets.join('-');
            })
            .join(',');
        }
        await this.saveService.save();
      },
    );
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
      this.testObservable.next([
        (event.target as HTMLTextAreaElement).value,
        note,
      ]);
    }
  }
}
