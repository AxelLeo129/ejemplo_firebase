import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPaymentPageRoutingModule } from './add-payment-routing.module';

import { AddPaymentPage } from './add-payment.page';
import { TranslateModule } from '@ngx-translate/core';
import { LiveChatModalPageModule } from './../../components/live-chat-modal/live-chat-modal.module';
import { LiveChatModalPage } from './../../components/live-chat-modal/live-chat-modal.page';
import { NgxMaskModule } from 'ngx-mask';
@NgModule({
  entryComponents: [
    LiveChatModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPaymentPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    LiveChatModalPageModule,
    NgxMaskModule
  ],
  declarations: [AddPaymentPage]
})
export class AddPaymentPageModule {}
