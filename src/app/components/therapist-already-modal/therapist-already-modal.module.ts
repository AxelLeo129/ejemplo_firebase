import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TherapistAlreadyModalPageRoutingModule } from './therapist-already-modal-routing.module';

import { TherapistAlreadyModalPage } from './therapist-already-modal.page';
import { TranslateModule } from '@ngx-translate/core';
import { LiveChatModalPageModule } from '../live-chat-modal/live-chat-modal.module';
import { LiveChatModalPage } from '../live-chat-modal/live-chat-modal.page';

@NgModule({
  entryComponents: [
    LiveChatModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TherapistAlreadyModalPageRoutingModule,
    TranslateModule,
    LiveChatModalPageModule
  ],
  declarations: [TherapistAlreadyModalPage]
})
export class TherapistAlreadyModalPageModule {}
