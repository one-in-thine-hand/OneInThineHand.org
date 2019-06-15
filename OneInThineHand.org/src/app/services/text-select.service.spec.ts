import { TestBed } from '@angular/core/testing';

import { TextSelectService } from './text-select.service';

describe('TextSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextSelectService = TestBed.get(TextSelectService);
    expect(service).toBeTruthy();
  });
});
