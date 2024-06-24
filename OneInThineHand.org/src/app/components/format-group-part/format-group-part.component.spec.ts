import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatGroupPartComponent } from './format-group-part.component';

describe('FormatGroupPartComponent', () => {
  let component: FormatGroupPartComponent;
  let fixture: ComponentFixture<FormatGroupPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatGroupPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatGroupPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
