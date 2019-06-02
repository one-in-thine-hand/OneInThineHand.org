import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatGroupComponent } from './format-group.component';

describe('FormatGroupComponent', () => {
  let component: FormatGroupComponent;
  let fixture: ComponentFixture<FormatGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
