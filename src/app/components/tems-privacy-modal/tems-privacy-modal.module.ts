import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TemsPrivacyModalPageRoutingModule } from './tems-privacy-modal-routing.module';

import { TemsPrivacyModalPage } from './tems-privacy-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TemsPrivacyModalPageRoutingModule,
    TranslateModule
  ],
  declarations: [TemsPrivacyModalPage]
})
export class TemsPrivacyModalPageModule {}
