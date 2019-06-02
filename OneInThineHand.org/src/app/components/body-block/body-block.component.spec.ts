import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyBlockComponent } from './body-block.component';

describe('BodyBlockComponent', () => {
  let component: BodyBlockComponent;
  let fixture: ComponentFixture<BodyBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
