import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  public constructor(public headerService: HeaderService) {}

  public ngOnInit(): void {
    this.headerService.headerTitle = 'One In Thine Hand';
    this.headerService.headerShortTitle = 'On In Thine Hand';
  }
}
