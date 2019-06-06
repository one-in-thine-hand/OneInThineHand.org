import { Component, OnInit, Input } from '@angular/core';
import { VisibilityService } from '../../services/visibility.service';
import { ChapterService } from '../../services/chapter.service';
import { NoteRef } from '../../../../../shared/src/shared';

@Component({
  selector: 'app-note-ref',
  templateUrl: './note-ref.component.html',
  styleUrls: ['./note-ref.component.scss'],
})
export class NoteRefComponent implements OnInit {
  @Input() public noteRef: NoteRef;

  public constructor(
    public chapterService: ChapterService,
    public visibilityService: VisibilityService,
  ) {}

  public ngOnInit() {}
}
