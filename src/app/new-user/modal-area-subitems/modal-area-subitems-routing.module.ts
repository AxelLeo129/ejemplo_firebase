import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAreaSubitemsPage } from './modal-area-subitems.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAreaSubitemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAreaSubitemsPageRoutingModule {}
