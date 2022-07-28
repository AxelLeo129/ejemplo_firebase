import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseSliderPageRoutingModule } from './exercise-slider-routing.module';

import { ExerciseSliderPage } from './exercise-slider.page';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseModalPageModule } from './../../components/exercise-modal/exercise-modal.module';
import { ExerciseModalPage } from './../../components/exercise-modal/exercise-modal.page';

import { GaugeComponent } from "./../../compontents/gauge/gauge.component";
import { GaugeChartModule } from 'angular-gauge-chart';

@NgModule({
  entryComponents: [
    ExerciseModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExerciseSliderPageRoutingModule,
    TranslateModule,
    GaugeChartModule,
    ExerciseModalPageModule
  ],
  declarations: [ExerciseSliderPage, GaugeComponent]
})
export class ExerciseSliderPageModule { }
