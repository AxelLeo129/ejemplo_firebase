import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmotionTrackerHistoryPageRoutingModule } from './emotion-tracker-history-routing.module';

import { EmotionTrackerHistoryPage } from './emotion-tracker-history.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    EmotionTrackerHistoryPageRoutingModule,
  ],
  declarations: [EmotionTrackerHistoryPage]
})
export class EmotionTrackerHistoryPageModule {}
