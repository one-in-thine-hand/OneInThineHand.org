import { Component, OnInit } from '@angular/core';
import { Verse } from '../../../../../shared/src/shared';

@Component({
  selector: 'app-body-block',
  templateUrl: './body-block.component.html',
  styleUrls: ['./body-block.component.scss'],
})
export class BodyBlockComponent implements OnInit {
  @Input() public verses: Verse[];
  constructor() {}

  ngOnInit() {}
}
