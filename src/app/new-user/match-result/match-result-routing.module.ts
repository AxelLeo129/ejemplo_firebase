import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchResultPage } from './match-result.page';

const routes: Routes = [
  {
    path: '',
    component: MatchResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchResultPageRoutingModule {}
