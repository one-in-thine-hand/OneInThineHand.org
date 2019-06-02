import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotePhraseComponent } from './note-phrase.component';

describe('NotePhraseComponent', () => {
  let component: NotePhraseComponent;
  let fixture: ComponentFixture<NotePhraseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotePhraseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotePhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
