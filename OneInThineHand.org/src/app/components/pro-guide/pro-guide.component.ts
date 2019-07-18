import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { scrollIntoView } from '../../scroll-into-view';

@Component({
  selector: 'app-pro-guide',
  templateUrl: './pro-guide.component.html',
  styleUrls: ['./pro-guide.component.scss'],
})
export class ProGuideComponent implements OnInit {
  @Input() id?: string;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    if (this.id) {
      scrollIntoView(`#${this.id}`, {
        document: document,
        timeout: 109,
        scollIntoViewOptions: { block: 'center' },
      });

      const e = document.getElementById(this.id);
      if (e) {
        e.classList.add('highlight');
      }
    }
  }
}
