import { TestBed } from '@angular/core/testing';

import { FormatTagService } from './format-tag.service';

describe('FormatTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormatTagService = TestBed.get(FormatTagService);
    expect(service).toBeTruthy();
  });
});
