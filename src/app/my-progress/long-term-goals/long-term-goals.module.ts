import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LongTermGoalsPageRoutingModule } from './long-term-goals-routing.module';

import { LongTermGoalsPage } from './long-term-goals.page';
import { TranslateModule } from '@ngx-translate/core';
import { GoalsModalPageModule } from 'src/app/components/goals-modal/goals-modal.module';
import { GoalsModalPage } from 'src/app/components/goals-modal/goals-modal.page';

@NgModule({
  entryComponents: [
    GoalsModalPage
  ],
  imports: [
    GoalsModalPageModule,
    CommonModule,
    FormsModule,
    IonicModule,
    LongTermGoalsPageRoutingModule,
    TranslateModule
  ],
  declarations: [LongTermGoalsPage]
})
export class LongTermGoalsPageModule {}
