import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResponsesHistoryPageRoutingModule } from './responses-history-routing.module';

import { ResponsesHistoryPage } from './responses-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResponsesHistoryPageRoutingModule
  ],
  declarations: [ResponsesHistoryPage]
})
export class ResponsesHistoryPageModule {}
