import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NeedHelpPageRoutingModule } from './need-help-routing.module';

import { NeedHelpPage } from './need-help.page';
import { TranslateModule } from '@ngx-translate/core';
import { TherapistAlreadyModalPageModule } from 'src/app/components/therapist-already-modal/therapist-already-modal.module';
import { TherapistAlreadyModalPage } from 'src/app/components/therapist-already-modal/therapist-already-modal.page';

@NgModule({
  entryComponents: [
    TherapistAlreadyModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NeedHelpPageRoutingModule,
    TranslateModule,
    TherapistAlreadyModalPageModule
  ],
  declarations: [NeedHelpPage]
})
export class NeedHelpPageModule {}
