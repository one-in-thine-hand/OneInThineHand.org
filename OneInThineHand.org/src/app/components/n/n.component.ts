import { Component, OnInit, Input, HostListener } from '@angular/core';
import {
  Note,
  VerseNotes,
  getVisible,
  getReferenceLabelByNoteCategory,
  NoteRef,
  NotePhrase,
  ReferenceLabels,
  getRanges,
} from '../../../../../shared/src/shared';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { OffsetService } from '../../services/offset.service';
import { ChapterService } from '../../services/chapter.service';
import { FormatTagService } from '../../services/format-tag.service';
import { SaveService } from '../../services/save.service';
import { TempSettingsService } from '../../services/temp-settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-n',
  templateUrl: './n.component.html',
  styleUrls: ['./n.component.scss'],
})
export class NComponent implements OnInit {
  public edit = false;
  @Input() public note: Note;
  @Input() public verseNotes: VerseNotes;
  // @HostListener('click', ['$event'])
  // public routerLinks(event: MouseEvent): void {
  //   const href = (event.target as HTMLAnchorElement).href as string | undefined;
  //   if (href) {
  //     console.log(href.split('#/')[1].replace('jst-', 'eng/jst_'));

  //     this.router.navigateByUrl(
  //       href.split('#/')[1].replace('jst-', 'eng/jst_'),
  //     );
  //   }
  // }

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
    // console.log(noteRef.none);

    if (noteRef.none === true) {
      return '';
    }
    const nc = ReferenceLabels.find((rl): boolean => {
      // if (
      //   rl.noteCategory === noteRef.noteCategory &&
      //   noteRef.text &&
      //   noteRef.text.includes('many')
      // ) {
      //   // console.log(ReferenceLabels);
      // }
      return rl.noteCategory === noteRef.noteCategory;
    });
    // if (noteRef.text && noteRef.text.includes('many')) {
    //   // console.log(nc);
    // }
    return nc ? nc.referenceLabelShortName : 'extERR';
  }

  public getNotePhrase(notePhrase: NotePhrase | undefined): string {
    return notePhrase && notePhrase.text
      ? notePhrase.text
      : 'Note Phrase Missing';
  }
  public getNoteRefs(secondaryNote: Note): NoteRef[] {
    // return getVisible(secondaryNote.noteRefs)
    // return secondaryNote.noteRefs.reverse();
    return getVisible(secondaryNote.noteRefs);
  }

  public getNoteRefText(noteRef: NoteRef): SafeHtml {
    return noteRef.safeHtml;
    // return this.domSanitizer.bypassSecurityTrustHtml(
    //   noteRef.text ? noteRef.text : '',
    // );
  }
  public getRefClass(noteRef: NoteRef): string {
    if (noteRef && noteRef.noteCategory) {
      const nC = getReferenceLabelByNoteCategory(noteRef.noteCategory);
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
    return note.refTag && note.refTag.highlight ? true : false;
  }

  public ngOnInit(): void {
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
      // const supportedCharacters = [
      //   '0',
      //   '1',
      //   '2',
      //   '3',
      //   '4',
      //   '5',
      //   '6',
      //   '7',
      //   '8',
      //   '9',
      //   ',',
      //   '-',
      // ];
      // note.offsets = (event.target as HTMLTextAreaElement).value
      //   .split('')
      //   .map((v): string => {
      //     return supportedCharacters.includes(v) ? v : '';
      //   })
      //   .join('');
      // console.log(note.offsets);
      note.offsets = (event.target as HTMLTextAreaElement).value;

      await this.offsetService.expandNotes(this.chapterService.notes);
      await this.formatTagService.resetFormatTags(
        this.chapterService.chapterVerses,
        this.chapterService.chapterNotes,
      );

      await this.formatTagService.resetFormatTags(
        this.chapterService.kjvChapterVerse,
        this.chapterService.kjvChapterNotes,
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
