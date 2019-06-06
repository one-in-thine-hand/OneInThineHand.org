import { TestBed } from '@angular/core/testing';

import { SaveStateService } from './save-state.service';

describe('SaveStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveStateService = TestBed.get(SaveStateService);
    expect(service).toBeTruthy();
  });
});
