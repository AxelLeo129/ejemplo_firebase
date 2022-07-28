import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { ChatMenuModalPageModule } from './../../components/chat-menu-modal/chat-menu-modal.module';
import { ChatMenuModalPage } from './../../components/chat-menu-modal/chat-menu-modal.page';
import { NotificationModalPageModule } from './../../components/notification-modal/notification-modal.module';
import { NotificationModalPage } from './../../components/notification-modal/notification-modal.page';
import { TranslateModule } from '@ngx-translate/core';
import { VideoModalPageModule } from './../../components/video-modal/video-modal.module';
import { VideoModalPage } from './../../components/video-modal/video-modal.page';
import { ModalRateTherapistPage } from './../../components/modal-rate-therapist/modal-rate-therapist.page';
import { ModalRateTherapistPageModule } from './../../components/modal-rate-therapist/modal-rate-therapist.module';
@NgModule({
  entryComponents: [
    ChatMenuModalPage,
    NotificationModalPage,
    VideoModalPage,
    ModalRateTherapistPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    ChatMenuModalPageModule,
    NotificationModalPageModule,
    TranslateModule,
    VideoModalPageModule,
    ModalRateTherapistPageModule
  ],
  declarations: [ChatPage]
})
export class ChatPageModule { }
