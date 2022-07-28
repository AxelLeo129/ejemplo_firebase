import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreaOptionsSelectedModalPageRoutingModule } from './area-options-selected-modal-routing.module';

import { AreaOptionsSelectedModalPage } from './area-options-selected-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreaOptionsSelectedModalPageRoutingModule,
    TranslateModule
  ],
  declarations: [AreaOptionsSelectedModalPage]
})
export class AreaOptionsSelectedModalPageModule {}
