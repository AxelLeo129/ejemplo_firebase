import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreasOptionsSelectedPage } from './areas-options-selected.page';

const routes: Routes = [
  {
    path: '',
    component: AreasOptionsSelectedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreasOptionsSelectedPageRoutingModule {}
