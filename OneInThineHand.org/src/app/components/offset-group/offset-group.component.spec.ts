import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffsetGroupComponent } from './offset-group.component';

describe('OffsetGroupComponent', () => {
  let component: OffsetGroupComponent;
  let fixture: ComponentFixture<OffsetGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffsetGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffsetGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
