import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExerciseCompletedPage } from './exercise-completed.page';

const routes: Routes = [
  {
    path: '',
    component: ExerciseCompletedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseCompletedPageRoutingModule {}
