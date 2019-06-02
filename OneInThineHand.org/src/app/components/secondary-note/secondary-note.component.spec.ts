import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryNoteComponent } from './secondary-note.component';

describe('SecondaryNoteComponent', () => {
  let component: SecondaryNoteComponent;
  let fixture: ComponentFixture<SecondaryNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
