import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExerciseSliderPage } from './exercise-slider.page';

const routes: Routes = [
  {
    path: '',
    component: ExerciseSliderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseSliderPageRoutingModule {}
