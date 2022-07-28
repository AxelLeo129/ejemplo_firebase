import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExercisesSummaryPage } from './exercises-summary.page';

const routes: Routes = [
  {
    path: '',
    component: ExercisesSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesSummaryPageRoutingModule {}
