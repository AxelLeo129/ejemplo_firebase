import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgressListPage } from './progress-list.page';

const routes: Routes = [
  {
    path: '',
    component: ProgressListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgressListPageRoutingModule {}
