import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DpiPopoverPageRoutingModule } from './dpi-popover-routing.module';

import { DpiPopoverPage } from './dpi-popover.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DpiPopoverPageRoutingModule,
    TranslateModule
  ],
  declarations: [DpiPopoverPage]
})
export class DpiPopoverPageModule {}
