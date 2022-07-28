import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadDpiPage } from './upload-dpi.page';

const routes: Routes = [
  {
    path: '',
    component: UploadDpiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadDpiPageRoutingModule {}
