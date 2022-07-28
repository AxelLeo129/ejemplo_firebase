import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExerciseSummaryPage } from './exercise-summary.page';

const routes: Routes = [
  {
    path: '',
    component: ExerciseSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseSummaryPageRoutingModule {}
