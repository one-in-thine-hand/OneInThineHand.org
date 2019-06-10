import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  public headerTitle: string = '';
  public headerShortTitle: string = '';
  public constructor() {}

  public getTitle(): string {
    return this.headerTitle;
  }
}
