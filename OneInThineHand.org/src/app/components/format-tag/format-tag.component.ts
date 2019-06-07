import { Component, OnInit, Input } from '@angular/core';
import { FormatTag } from '../../../../../shared/src/shared';
import { FMerged } from '../../../../../shared/src/models/format_tags/FormatTag';

@Component({
  selector: 'app-format-tag',
  templateUrl: './format-tag.component.html',
  styleUrls: ['./format-tag.component.scss'],
})
export class FormatTagComponent implements OnInit {
  @Input() public formatTag: FMerged;
  constructor() {}

  ngOnInit() {}
}
