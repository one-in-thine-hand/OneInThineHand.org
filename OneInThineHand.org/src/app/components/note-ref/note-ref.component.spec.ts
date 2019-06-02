import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteRefComponent } from './note-ref.component';

describe('NoteRefComponent', () => {
  let component: NoteRefComponent;
  let fixture: ComponentFixture<NoteRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
