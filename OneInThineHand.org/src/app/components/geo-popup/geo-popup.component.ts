import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-geo-popup',
  templateUrl: './geo-popup.component.html',
  styleUrls: ['./geo-popup.component.scss'],
})
export class GeoPopupComponent implements OnInit {
  @Input() public id?: string;
  constructor(public activeModal: NgbActiveModal) {}
  public ngOnInit() {}

  public openImage(id: string): void {
    window.open(`assets/images/${id}`);
  }
}
