import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { ChapterService } from '../../services/chapter.service';
import { SaveService } from '../../services/save.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  public constructor(
    public headerService: HeaderService,
    public chapterService: ChapterService,
    public saveService: SaveService,
  ) {}

  public ngOnInit(): void {
    this.headerService.headerTitle = 'One in Thine Hand';
    this.headerService.headerShortTitle = 'On In Thine Hand';
    // this.chapterService.chapterNotes = undefined;
  }
}
