import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExercisesSummaryPageRoutingModule } from './exercises-summary-routing.module';

import { ExercisesSummaryPage } from './exercises-summary.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExercisesSummaryPageRoutingModule,
    TranslateModule
  ],
  declarations: [ExercisesSummaryPage]
})
export class ExercisesSummaryPageModule {}
