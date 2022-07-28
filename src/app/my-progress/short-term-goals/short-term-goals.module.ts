import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShortTermGoalsPageRoutingModule } from './short-term-goals-routing.module';

import { ShortTermGoalsPage } from './short-term-goals.page';
import { TranslateModule } from '@ngx-translate/core';
import { GoalsModalPageModule } from 'src/app/components/goals-modal/goals-modal.module';
import { GoalsModalPage } from 'src/app/components/goals-modal/goals-modal.page';

@NgModule({
  entryComponents: [
    GoalsModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShortTermGoalsPageRoutingModule,
    TranslateModule,
    GoalsModalPageModule
  ],
  declarations: [ShortTermGoalsPage]
})
export class ShortTermGoalsPageModule {}
