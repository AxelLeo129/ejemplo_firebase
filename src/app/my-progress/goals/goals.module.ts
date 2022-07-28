import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoalsPageRoutingModule } from './goals-routing.module';

import { GoalsPage } from './goals.page';
import { TranslateModule } from '@ngx-translate/core';
import { GoalsModalPageModule } from 'src/app/components/goals-modal/goals-modal.module';
import { GoalsModalPage } from 'src/app/components/goals-modal/goals-modal.page';
import { GoalPercentangePage } from 'src/app/components/goal-percentange/goal-percentange.page';
import { GoalPercentangePageModule } from 'src/app/components/goal-percentange/goal-percentange.module';

@NgModule({
  entryComponents: [
    GoalsModalPage,
    GoalPercentangePage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoalsPageRoutingModule,
    TranslateModule,
    GoalsModalPageModule,
    GoalPercentangePageModule
  ],
  declarations: [GoalsPage]
})
export class GoalsPageModule {}
