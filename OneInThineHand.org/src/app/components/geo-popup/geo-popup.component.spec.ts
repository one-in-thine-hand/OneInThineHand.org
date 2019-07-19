import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoPopupComponent } from './geo-popup.component';

describe('GeoPopupComponent', () => {
  let component: GeoPopupComponent;
  let fixture: ComponentFixture<GeoPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
