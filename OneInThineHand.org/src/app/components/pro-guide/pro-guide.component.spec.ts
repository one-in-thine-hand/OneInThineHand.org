import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProGuideComponent } from './pro-guide.component';

describe('ProGuideComponent', () => {
  let component: ProGuideComponent;
  let fixture: ComponentFixture<ProGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
