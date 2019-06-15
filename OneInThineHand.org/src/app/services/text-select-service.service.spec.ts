import { TestBed } from '@angular/core/testing';

import { TextSelectServiceService } from './text-select-service.service';

describe('TextSelectServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextSelectServiceService = TestBed.get(TextSelectServiceService);
    expect(service).toBeTruthy();
  });
});
