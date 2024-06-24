import { TestBed } from '@angular/core/testing';

import { TempSettingsService } from './temp-settings.service';

describe('TempSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TempSettingsService = TestBed.get(TempSettingsService);
    expect(service).toBeTruthy();
  });
});
