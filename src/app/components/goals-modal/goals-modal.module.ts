import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoalsModalPageRoutingModule } from './goals-modal-routing.module';

import { GoalsModalPage } from './goals-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoalsModalPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [GoalsModalPage]
})
export class GoalsModalPageModule {}
