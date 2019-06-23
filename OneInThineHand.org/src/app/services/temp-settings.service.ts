import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TempSettingsService {
  public editMode = false;
  public navigationMobilePaneToggle: boolean = false;
  constructor() {}
}
