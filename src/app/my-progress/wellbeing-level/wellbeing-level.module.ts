import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WellbeingLevelPageRoutingModule } from './wellbeing-level-routing.module';

import { WellbeingLevelPage } from './wellbeing-level.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WellbeingLevelPageRoutingModule,
    TranslateModule
  ],
  declarations: [WellbeingLevelPage]
})
export class WellbeingLevelPageModule {}
