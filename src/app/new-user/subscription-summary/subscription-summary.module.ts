import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionSummaryPageRoutingModule } from './subscription-summary-routing.module';

import { SubscriptionSummaryPage } from './subscription-summary.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscriptionSummaryPageRoutingModule,
    TranslateModule
  ],
  declarations: [SubscriptionSummaryPage]
})
export class SubscriptionSummaryPageModule {}
