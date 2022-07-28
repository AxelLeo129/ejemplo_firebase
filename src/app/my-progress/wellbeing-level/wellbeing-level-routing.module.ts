import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WellbeingLevelPage } from './wellbeing-level.page';

const routes: Routes = [
  {
    path: '',
    component: WellbeingLevelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WellbeingLevelPageRoutingModule {}
