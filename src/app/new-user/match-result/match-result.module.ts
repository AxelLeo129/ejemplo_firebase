import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchResultPageRoutingModule } from './match-result-routing.module';

import { MatchResultPage } from './match-result.page';
import { TranslateModule } from '@ngx-translate/core';
import { LiveChatModalPageModule } from 'src/app/components/live-chat-modal/live-chat-modal.module';
import { LiveChatModalPage } from 'src/app/components/live-chat-modal/live-chat-modal.page';

@NgModule({
  entryComponents: [
    LiveChatModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchResultPageRoutingModule,
    TranslateModule,
    LiveChatModalPageModule
  ],
  declarations: [MatchResultPage]
})
export class MatchResultPageModule {}
