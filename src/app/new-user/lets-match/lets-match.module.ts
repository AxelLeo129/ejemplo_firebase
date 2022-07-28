import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LetsMatchPageRoutingModule } from './lets-match-routing.module';

import { LetsMatchPage } from './lets-match.page';
import { TranslateModule } from '@ngx-translate/core';
import { DpiPopoverPageModule } from 'src/app/components/dpi-popover/dpi-popover.module';
import { DpiPopoverPage } from 'src/app/components/dpi-popover/dpi-popover.page';

@NgModule({
  entryComponents: [
    DpiPopoverPage
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    LetsMatchPageRoutingModule,
    TranslateModule,
    DpiPopoverPageModule
  ],
  declarations: [LetsMatchPage]
})
export class LetsMatchPageModule {}
