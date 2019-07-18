import { TestBed } from '@angular/core/testing';

import { ProGuideService } from './pro-guide.service';

describe('ProGuideService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProGuideService = TestBed.get(ProGuideService);
    expect(service).toBeTruthy();
  });
});
