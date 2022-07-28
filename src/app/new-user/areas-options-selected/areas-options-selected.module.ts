import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreasOptionsSelectedPageRoutingModule } from './areas-options-selected-routing.module';

import { AreasOptionsSelectedPage } from './areas-options-selected.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreasOptionsSelectedPageRoutingModule
  ],
  declarations: [AreasOptionsSelectedPage]
})
export class AreasOptionsSelectedPageModule {}
