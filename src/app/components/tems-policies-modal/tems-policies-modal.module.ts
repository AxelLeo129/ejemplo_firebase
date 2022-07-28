import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TemsPoliciesModalPageRoutingModule } from './tems-policies-modal-routing.module';

import { TemsPoliciesModalPage } from './tems-policies-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TemsPoliciesModalPageRoutingModule,
    TranslateModule
  ],
  declarations: [TemsPoliciesModalPage]
})
export class TemsPoliciesModalPageModule {}
