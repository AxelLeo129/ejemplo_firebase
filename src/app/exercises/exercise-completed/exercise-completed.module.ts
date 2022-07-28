import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseCompletedPageRoutingModule } from './exercise-completed-routing.module';

import { ExerciseCompletedPage } from './exercise-completed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExerciseCompletedPageRoutingModule
  ],
  declarations: [ExerciseCompletedPage]
})
export class ExerciseCompletedPageModule {}
