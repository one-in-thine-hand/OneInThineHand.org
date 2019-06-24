import { Component, OnInit, Input } from '@angular/core';
import {
  Note,
  NotePhrase,
  VerseNotes,
} from '../../../../../shared/src/models/notes/Note';
import { ChapterService } from '../../services/chapter.service';
import { OffsetService } from '../../services/offset.service';
import { FormatTagService } from '../../services/format-tag.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveService } from '../../services/save.service';

@Component({
  selector: 'app-note-phrase',
  templateUrl: './note-phrase.component.html',
  styleUrls: ['./note-phrase.component.scss'],
})
export class NotePhraseComponent implements OnInit {
  @Input() public note: Note;
  @Input() public verseNotes: VerseNotes;

  public constructor(
    public chapterService: ChapterService,
    public offsetService: OffsetService,
    public formatTagService: FormatTagService,
    public modalService: NgbModal,
    public saveService: SaveService,
  ) {}
  public ngOnInit(): void {}

  public getNotePhrase(notePhrase: NotePhrase | undefined): string {
    return notePhrase && notePhrase.text
      ? notePhrase.text
      : 'Note Phrase Missing';
  }

  private validateSelectedNodes(node: Node): Element | undefined {
    if (
      (node as HTMLElement).getAttribute !== undefined &&
      (node as HTMLElement).getAttribute('offsets') !== null
    ) {
      return node as Element;
    } else {
      let parentElement: Element | undefined | null = node.parentElement;

      while (
        parentElement &&
        parentElement.getAttribute !== null &&
        parentElement.getAttribute('offsets') === null
      ) {
        parentElement = parentElement.parentElement;
      }
      if (parentElement) {
        return parentElement;
      }
    }
    return undefined;
  }
  public async notePhraseClick(secondaryNote: Note): Promise<void> {
    const selection = window.getSelection();

    if (selection) {
      try {
        await this.addOffsets(selection, secondaryNote);
      } catch (error) {}

      if (secondaryNote.refTag) {
        const oldHighlight = secondaryNote.refTag.highlight;
        this.chapterService.resetNoteVis();
        secondaryNote.refTag.highlight = !oldHighlight;
      }
    }
  }

  private async addOffsets(
    selection: Selection,
    secondaryNote: Note,
  ): Promise<void> {
    const range = selection.getRangeAt(0);
    if (range.toString().length === 0) {
      throw new Error('No selection');
    }
    const elements = [
      this.validateSelectedNodes(range.startContainer),
      this.validateSelectedNodes(range.endContainer),
    ];
    if (elements[0] !== undefined && elements[1] !== undefined) {
      const element1VerseID = (elements[0] as HTMLElement).getAttribute(
        'verse-id',
      );
      const element2VerseID = (elements[1] as HTMLElement).getAttribute(
        'verse-id',
      );
      if (
        element1VerseID &&
        `${element1VerseID}-notes` === this.verseNotes._id &&
        element2VerseID &&
        `${element2VerseID}-notes` === this.verseNotes._id
      ) {
        const offsets1 = ((elements[0] as HTMLElement).getAttribute(
          'offsets',
        ) as string).split('-');
        const offsets2 = ((elements[1] as HTMLElement).getAttribute(
          'offsets',
        ) as string).split('-');

        if (secondaryNote.offsets === undefined) {
          secondaryNote.offsets = '';
        }
        secondaryNote.offsets = `${`${parseInt(offsets1[0], 10) +
          range.startOffset}-${parseInt(offsets2[0], 10) +
          range.endOffset -
          1}`},${secondaryNote.offsets}`;
        await this.offsetService.expandNotes(this.chapterService.notes);
        await this.formatTagService.resetFormatTags(
          this.chapterService.chapterVerses,
          this.chapterService.chapterNotes,
        );
        if (this.chapterService.chapterNotes) {
          this.chapterService.chapterNotes.save = true;
        }

        this.saveService.save();

        if (secondaryNote.refTag) {
          secondaryNote.refTag.highlight = false;
        }
      } else {
        throw 'No valid selection';
      }
    }
  }
}
