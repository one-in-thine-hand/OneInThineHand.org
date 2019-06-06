import { TestBed } from '@angular/core/testing';

import { ChapterServiceService } from './chapter-service.service';

describe('ChapterServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChapterServiceService = TestBed.get(ChapterServiceService);
    expect(service).toBeTruthy();
  });
});
