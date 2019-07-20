import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCategorySettingsComponent } from './note-category-settings.component';

describe('NoteCategorySettingsComponent', () => {
  let component: NoteCategorySettingsComponent;
  let fixture: ComponentFixture<NoteCategorySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteCategorySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteCategorySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
