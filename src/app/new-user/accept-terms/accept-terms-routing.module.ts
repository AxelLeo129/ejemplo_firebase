import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcceptTermsPage } from './accept-terms.page';

const routes: Routes = [
  {
    path: '',
    component: AcceptTermsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcceptTermsPageRoutingModule {}
