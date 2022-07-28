import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutAppModalPageRoutingModule } from './about-app-modal-routing.module';

import { AboutAppModalPage } from './about-app-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutAppModalPageRoutingModule,
    TranslateModule
  ],
  declarations: [AboutAppModalPage]
})
export class AboutAppModalPageModule {}
