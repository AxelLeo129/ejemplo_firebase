import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LongTermGoalsPage } from './long-term-goals.page';

const routes: Routes = [
  {
    path: '',
    component: LongTermGoalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LongTermGoalsPageRoutingModule {}
