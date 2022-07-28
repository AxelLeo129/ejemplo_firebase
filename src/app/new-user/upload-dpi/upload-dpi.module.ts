import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadDpiPageRoutingModule } from './upload-dpi-routing.module';

import { UploadDpiPage } from './upload-dpi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadDpiPageRoutingModule
  ],
  declarations: [UploadDpiPage]
})
export class UploadDpiPageModule {}
