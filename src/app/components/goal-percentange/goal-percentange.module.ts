import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoalPercentangePageRoutingModule } from './goal-percentange-routing.module';

import { GoalPercentangePage } from './goal-percentange.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoalPercentangePageRoutingModule
  ],
  declarations: [GoalPercentangePage]
})
export class GoalPercentangePageModule {}
