import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChapterComponent } from './components/chapter/chapter.component';

const routes: Routes = [
  {
    path: '',
    component: ChapterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
