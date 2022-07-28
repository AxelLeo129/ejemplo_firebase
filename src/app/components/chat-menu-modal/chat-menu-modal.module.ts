import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatMenuModalPageRoutingModule } from './chat-menu-modal-routing.module';

import { ChatMenuModalPage } from './chat-menu-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatMenuModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [ChatMenuModalPage]
})
export class ChatMenuModalPageModule {}
