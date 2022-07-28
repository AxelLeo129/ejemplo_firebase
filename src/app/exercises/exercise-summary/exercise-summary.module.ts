import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseSummaryPageRoutingModule } from './exercise-summary-routing.module';

import { ExerciseSummaryPage } from './exercise-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExerciseSummaryPageRoutingModule
  ],
  declarations: [ExerciseSummaryPage]
})
export class ExerciseSummaryPageModule {}
