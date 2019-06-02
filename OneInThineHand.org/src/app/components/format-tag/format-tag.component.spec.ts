import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatTagComponent } from './format-tag.component';

describe('FormatTagComponent', () => {
  let component: FormatTagComponent;
  let fixture: ComponentFixture<FormatTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
