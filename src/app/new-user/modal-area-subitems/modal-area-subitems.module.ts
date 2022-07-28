import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAreaSubitemsPageRoutingModule } from './modal-area-subitems-routing.module';

import { ModalAreaSubitemsPage } from './modal-area-subitems.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAreaSubitemsPageRoutingModule
  ],
  declarations: [ModalAreaSubitemsPage]
})
export class ModalAreaSubitemsPageModule {}
