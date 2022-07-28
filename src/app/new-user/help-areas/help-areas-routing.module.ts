import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpAreasPage } from './help-areas.page';

const routes: Routes = [
  {
    path: '',
    component: HelpAreasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpAreasPageRoutingModule {}
