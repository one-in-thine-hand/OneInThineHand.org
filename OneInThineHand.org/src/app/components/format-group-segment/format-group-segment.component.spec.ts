import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatGroupSegmentComponent } from './format-group-segment.component';

describe('FormatGroupSegmentComponent', () => {
  let component: FormatGroupSegmentComponent;
  let fixture: ComponentFixture<FormatGroupSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatGroupSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatGroupSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
