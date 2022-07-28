import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectSubscriptionPage } from './select-subscription.page';

const routes: Routes = [
  {
    path: '',
    component: SelectSubscriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectSubscriptionPageRoutingModule {}
