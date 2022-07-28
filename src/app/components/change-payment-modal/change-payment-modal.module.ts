import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePaymentModalPageRoutingModule } from './change-payment-modal-routing.module';

import { ChangePaymentModalPage } from './change-payment-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePaymentModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [ChangePaymentModalPage]
})
export class ChangePaymentModalPageModule {}
