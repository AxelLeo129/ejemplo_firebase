import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExerciseOnePage } from './exercise-one.page';

const routes: Routes = [
  {
    path: '',
    component: ExerciseOnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseOnePageRoutingModule {}
