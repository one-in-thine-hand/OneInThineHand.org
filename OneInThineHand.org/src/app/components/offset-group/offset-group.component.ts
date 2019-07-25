import { Component, OnInit, Input } from '@angular/core';
import { OffsetGroup } from '../../services/offset-groups.service';
import {
  VerseNote,
  Note,
  NoteGeography,
  NotePronunciation,
} from '../../models/verse-notes';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeoPopupComponent } from '../geo-popup/geo-popup.component';
import { ProGuideComponent } from '../pro-guide/pro-guide.component';

@Component({
  selector: 'app-offset-group',
  templateUrl: './offset-group.component.html',
  styleUrls: ['./offset-group.component.scss'],
})
export class OffsetGroupComponent implements OnInit {
  public audio: HTMLAudioElement;
  @Input() public offsetGroup: OffsetGroup;
  @Input() public verseNotes: VerseNote;
  public constructor(public modalService: NgbModal) {}
  public async geoClick(event: Event, note: NoteGeography): Promise<void> {
    console.log('jhhh');

    if ((event.target as HTMLElement).getAttribute('url')) {
      const url = (event.target as HTMLElement).getAttribute('url') as string;
      console.log(url);
      // alert(url);
      const result = await this.modalService.open(GeoPopupComponent, {
        ariaLabelledBy: 'modal-basic-title',
        backdropClass: 'add-notes-backdrop',
        backdrop: true,
      });

      result.componentInstance.id = url;
      // this.mod/ alService.open(ProGuideComponent);
    }
    //  else if (
    // note.href &&
    // (event.target as HTMLElement).classList.contains('note-category')
    // )
    // {
    // console.log(note);
    //
    // this.audio = new Audio(`assets/audio/${note.href}`);
    // this.audio.play();
    // }
  }

  public highlight(notes: Note[]): boolean {
    return (
      notes.filter((note): boolean => {
        return (
          note.noteRefFormatTag !== undefined &&
          note.noteRefFormatTag.highlight === true
        );
      }).length > 0
    );
  }

  public ngOnInit() {
    // console.log(this.offsetGroup);
  }
  public async pronunciationClick(
    event: Event,
    note: NotePronunciation,
  ): Promise<void> {
    if ((event.target as HTMLElement).getAttribute('url')) {
      const url = (event.target as HTMLElement).getAttribute('url') as string;
      // alert(url);
      const result = await this.modalService.open(ProGuideComponent, {
        ariaLabelledBy: 'modal-basic-title',
        backdropClass: 'add-notes-backdrop',
        backdrop: true,
      });

      result.componentInstance.id = 'figure13_p21';
      // this.mod/ alService.open(ProGuideComponent);
    } else if (
      note.href &&
      (event.target as HTMLElement).classList.contains('note-category')
    ) {
      // console.log(note);

      console.log(note.href);

      this.audio = new Audio(`assets/audio/${note.href}`);
      this.audio.play();
    }
  }
}
