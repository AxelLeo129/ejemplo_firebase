import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectedAreasPage } from './selected-areas.page';

const routes: Routes = [
  {
    path: '',
    component: SelectedAreasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectedAreasPageRoutingModule {}
