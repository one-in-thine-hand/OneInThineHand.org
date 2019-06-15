import { TestBed } from '@angular/core/testing';

import { FlattenService } from './flatten.service';

describe('FlattenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlattenService = TestBed.get(FlattenService);
    expect(service).toBeTruthy();
  });
});
