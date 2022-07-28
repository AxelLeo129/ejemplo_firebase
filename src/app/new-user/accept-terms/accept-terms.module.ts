import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcceptTermsPageRoutingModule } from './accept-terms-routing.module';

import { AcceptTermsPage } from './accept-terms.page';
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
    AcceptTermsPageRoutingModule,
    LiveChatModalPageModule
  ],
  declarations: [AcceptTermsPage]
})
export class AcceptTermsPageModule {}
