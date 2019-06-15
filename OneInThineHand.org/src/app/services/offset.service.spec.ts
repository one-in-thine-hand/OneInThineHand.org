import { TestBed } from '@angular/core/testing';

import { OffsetService } from './offset.service';

describe('OffsetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OffsetService = TestBed.get(OffsetService);
    expect(service).toBeTruthy();
  });
});
