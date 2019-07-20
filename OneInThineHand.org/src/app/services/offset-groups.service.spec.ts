import { TestBed } from '@angular/core/testing';

import { OffsetGroupsService } from './offset-groups.service';

describe('OffsetGroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OffsetGroupsService = TestBed.get(OffsetGroupsService);
    expect(service).toBeTruthy();
  });
});
