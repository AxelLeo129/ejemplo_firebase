import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentNotificationPageRoutingModule } from './payment-notification-routing.module';

import { PaymentNotificationPage } from './payment-notification.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentNotificationPageRoutingModule,
    TranslateModule
  ],
  declarations: [PaymentNotificationPage]
})
export class PaymentNotificationPageModule {}
