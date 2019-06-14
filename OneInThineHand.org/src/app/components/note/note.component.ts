import { Component, OnInit, Input } from '@angular/core';
import {
  NotePhrase,
  Note,
  SecondaryNote,
  getVisible,
  NoteRef,
} from '../../../../../shared/src/shared';
import { ReferenceLabels } from '../../../../../shared/src/models/notes/Note';
import { ChapterService } from '../../services/chapter.service';
import { OffsetService } from '../../services/offset.service';
import { FormatTagService } from '../../services/format-tag.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
  @Input() public note: Note;

  public constructor(
    public chapterService: ChapterService,
    public offsetService: OffsetService,
    public formatTagService: FormatTagService,
  ) {}

  public ngOnInit() {}

  public getNotePhrase(notePhrase: NotePhrase | undefined): string {
    return notePhrase && notePhrase.text
      ? notePhrase.text
      : 'Note Phrase Missing';
  }

  public getSecondaryNotes(): SecondaryNote[] {
    let secondaryNotes: SecondaryNote[] = [];
    if (this.note && this.note.secondaryNotes) {
      secondaryNotes = this.note.secondaryNotes.filter(
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

  public getNoteRefs(secondaryNote: SecondaryNote): NoteRef[] {
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

  public async notePhraseClick(secondaryNote: SecondaryNote): Promise<void> {
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
          console.log(this.note._id);

          if (
            element1VerseID &&
            element1VerseID.replace('verse', 'note') === this.note._id &&
            element2VerseID &&
            element2VerseID.replace('verse', 'note') === this.note._id
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
            );
          }
        }
        // console.log(elements);

        // console.log(range);
      } catch (error) {
        console.log(error);
      }
    }
    console.log(secondaryNote);
  }
}
