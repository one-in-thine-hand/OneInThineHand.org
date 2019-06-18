import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-title-header',
  templateUrl: './title-header.component.html',
  styleUrls: ['./title-header.component.scss'],
})
export class TitleHeaderComponent implements OnInit {
  public constructor(public headerService: HeaderService) {}
  public ngOnInit() {}
}
