import { Injectable } from '@angular/core';

// import {  } from "@ng-bootstrap/ng-bootstrap/";
@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  public headerTitle: string = '';
  public headerShortTitle: string = '';
  public constructor() {
    // router.events.subscribe((value): void => {
    //   // console.log('asdfoijaosdfij');
    //   if (value instanceof NavigationStart) {
    //     this.headerShortTitle = '';
    //     this.headerTitle = '';
    //   }
    // });
  }

  public getTitle(): string {
    // const chapterNameElement = document.querySelector('#chapterName');
    // console.log(chapterNameElement);

    // if (chapterNameElement && chapterNameElement.clientWidth < 500) {
    //   return this.headerShortTitle;
    // }
    return this.headerTitle;
  }
  public getShortTitle(): string {
    return this.headerShortTitle;
  }
}
