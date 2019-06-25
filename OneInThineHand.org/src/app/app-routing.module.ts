import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChapterComponent } from './components/chapter/chapter.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HarmonyComponent } from './components/harmony/harmony.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'harmony',
    component: HarmonyComponent,
  },
  {
    path: ':book/:chapter',
    component: ChapterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
