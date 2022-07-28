import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveChatModalPageRoutingModule } from './live-chat-modal-routing.module';

import { LiveChatModalPage } from './live-chat-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveChatModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [LiveChatModalPage]
})
export class LiveChatModalPageModule {}
