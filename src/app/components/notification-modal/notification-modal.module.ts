import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationModalPageRoutingModule } from './notification-modal-routing.module';

import { NotificationModalPage } from './notification-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationModalPageRoutingModule,
    TranslateModule
  ],
  declarations: [NotificationModalPage]
})
export class NotificationModalPageModule {}
