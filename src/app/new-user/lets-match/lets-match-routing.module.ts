import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LetsMatchPage } from './lets-match.page';

const routes: Routes = [
  {
    path: '',
    component: LetsMatchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LetsMatchPageRoutingModule {}
