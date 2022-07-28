import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentNotificationPage } from './payment-notification.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentNotificationPageRoutingModule {}
