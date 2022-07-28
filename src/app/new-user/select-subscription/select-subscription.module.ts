import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectSubscriptionPageRoutingModule } from './select-subscription-routing.module';

import { SelectSubscriptionPage } from './select-subscription.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectSubscriptionPageRoutingModule,
    TranslateModule
  ],
  declarations: [SelectSubscriptionPage]
})
export class SelectSubscriptionPageModule {}
