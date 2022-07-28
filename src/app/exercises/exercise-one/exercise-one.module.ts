import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseOnePageRoutingModule } from './exercise-one-routing.module';

import { ExerciseOnePage } from './exercise-one.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExerciseOnePageRoutingModule
  ],
  declarations: [ExerciseOnePage]
})
export class ExerciseOnePageModule {}
