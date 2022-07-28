import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionSummaryPage } from './subscription-summary.page';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionSummaryPageRoutingModule {}
