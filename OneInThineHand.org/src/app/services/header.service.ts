import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  public headerTitle: string = '';
  public headerShortTitle: string = '';
  public constructor(private router: Router) {
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
