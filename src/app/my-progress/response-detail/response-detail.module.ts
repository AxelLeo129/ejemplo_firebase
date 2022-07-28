import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResponseDetailPageRoutingModule } from './response-detail-routing.module';

import { ResponseDetailPage } from './response-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResponseDetailPageRoutingModule
  ],
  declarations: [ResponseDetailPage]
})
export class ResponseDetailPageModule {}
