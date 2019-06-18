import { Component, OnInit, Input } from '@angular/core';
import {
  NotePhrase,
  getVisible,
  NoteRef,
} from '../../../../../shared/src/shared';
import { ReferenceLabels } from '../../../../../shared/src/shared';
import { ChapterService } from '../../services/chapter.service';
import { OffsetService } from '../../services/offset.service';
import { FormatTagService } from '../../services/format-tag.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getInputValue } from './getInputValue';
import { VerseNotes, Note } from '../../../../../shared/src/models/notes/Note';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
  @Input() public verseNotes: VerseNotes;

  public tempNote: Note | undefined;
  public constructor(
    public chapterService: ChapterService,
    public offsetService: OffsetService,
    public formatTagService: FormatTagService,
    public modalService: NgbModal,
  ) {}

  public ngOnInit(): void {}

  public getNotePhrase(notePhrase: NotePhrase | undefined): string {
    return notePhrase && notePhrase.text
      ? notePhrase.text
      : 'Note Phrase Missing';
  }

  public getSecondaryNotes(): Note[] {
    let secondaryNotes: Note[] = [];
    if (this.verseNotes && this.verseNotes.notes) {
      secondaryNotes = this.verseNotes.notes.filter(
        (secondaryNote): boolean => {
          if (
            secondaryNote.visible &&
            secondaryNote.noteRefs &&
            secondaryNote.notePhrase
          ) {
            return getVisible(secondaryNote.noteRefs).length > 0;
          }
          return false;
        },
      );
    }
    return secondaryNotes;
  }

  public getNoteRefs(secondaryNote: Note): NoteRef[] {
    return getVisible(secondaryNote.noteRefs);
  }
  /**
   * convertNoteCategory
   */
  public convertNoteCategory(noteRef: NoteRef): string {
    const nc = ReferenceLabels.find(
      (rl): boolean => {
        return rl.noteCategory === noteRef.noteCategory;
      },
    );
    return nc ? nc.referenceLabelShortName : 'extERR';
  }

  private getContainerOffsets(container: HTMLElement): void {}

  public noteRefClick(event: Event): void {
    try {
      if (
        event.target !== null &&
        (event.target as Element).nodeName.toLowerCase() === 'a'
      ) {
      }
    } catch (error) {
      console.log(error);
    }
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
        const range = selection.getRangeAt(0);
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
          console.log(element1VerseID);
          console.log(this.verseNotes._id);

          if (
            element1VerseID &&
            element1VerseID.replace('verse', 'note') === this.verseNotes._id &&
            element2VerseID &&
            element2VerseID.replace('verse', 'note') === this.verseNotes._id
          ) {
            const offsets1 = ((elements[0] as HTMLElement).getAttribute(
              'offsets',
            ) as string).split('-');
            const offsets2 = ((elements[1] as HTMLElement).getAttribute(
              'offsets',
            ) as string).split('-');
            console.log(
              `${parseInt(offsets1[0], 10) + range.startOffset} ${parseInt(
                offsets2[0],
                10,
              ) +
                range.endOffset +
                1}`,
            );
            if (secondaryNote.offsets === undefined) {
              secondaryNote.offsets = '';
            }
            secondaryNote.offsets = `${`${parseInt(offsets1[0], 10) +
              range.startOffset}-${parseInt(offsets2[0], 10) +
              range.endOffset -
              1}`},${secondaryNote.offsets}`;
            this.offsetService.expandNotes(this.chapterService.notes);
            await this.formatTagService.resetFormatTags(
              this.chapterService.chapterVerses,
              this.chapterService.chapterNotes,
            );
          }
        }
        // console.log(elements);

        // console.log(range);
      } catch (error) {
        if (secondaryNote.refTag) {
          secondaryNote.refTag.highlight = !secondaryNote.refTag.highlight;
        }
        console.log(error);
      }
    } else {
    }
    console.log(secondaryNote);
  }

  public async addNote(content): Promise<void> {
    try {
      const result = await this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdropClass: 'add-notes-backdrop',
        backdrop: false,
      }).result;
      console.log(result);

      // .result.then(
      //   result => {
      //     this.closeResult = `Closed with: ${result}`;
      //   },
      //   reason => {
      //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      //   },
      // );
    } catch (error) {
      console.log(error);
    }
  }

  public saveNote(modal): void {
    this.tempNote = new Note();
    this.tempNote.notePhrase = new NotePhrase();
    this.tempNote.notePhrase.text = getInputValue('#noteTitleTemp');

    console.log(getInputValue('#noteReferenceTemp'));
    console.log(getInputValue('#noteReferenceLabelTemp'));
    modal.close('Save click');
  }
}

export function getTextContent(selector: string): string {
  const e = document.querySelector(selector);
  return e && e.textContent ? e.textContent : '';
}
