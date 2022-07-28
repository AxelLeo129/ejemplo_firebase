import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShortTermGoalsPage } from './short-term-goals.page';

const routes: Routes = [
  {
    path: '',
    component: ShortTermGoalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShortTermGoalsPageRoutingModule {}
