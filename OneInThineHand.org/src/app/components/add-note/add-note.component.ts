import { Component, OnInit, Input } from '@angular/core';
import { Note } from '../../../../../shared/src/shared';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss'],
})
export class AddNoteComponent implements OnInit {
  @Input() public note: Note;

  public constructor() {}
  public ngOnInit() {}
}
