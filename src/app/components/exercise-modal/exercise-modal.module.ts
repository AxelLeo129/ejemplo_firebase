import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseModalPageRoutingModule } from './exercise-modal-routing.module';

import { ExerciseModalPage } from './exercise-modal.page';
import { TranslateModule } from '@ngx-translate/core';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExerciseModalPageRoutingModule,
    TranslateModule,
    LottieModule
  ],
  declarations: [ExerciseModalPage]
})
export class ExerciseModalPageModule {}
