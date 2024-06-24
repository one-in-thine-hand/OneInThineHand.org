import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarmonyComponent } from './harmony.component';

describe('HarmonyComponent', () => {
  let component: HarmonyComponent;
  let fixture: ComponentFixture<HarmonyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarmonyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarmonyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
