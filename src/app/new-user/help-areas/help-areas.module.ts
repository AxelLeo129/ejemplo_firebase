import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpAreasPageRoutingModule } from './help-areas-routing.module';

import { HelpAreasPage } from './help-areas.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpAreasPageRoutingModule,
    TranslateModule
  ],
  declarations: [HelpAreasPage]
})
export class HelpAreasPageModule {}
