import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BioModalPage } from './bio-modal.page';
import { LottieModule } from 'ngx-lottie';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LottieModule,
    TranslateModule
  ],
  declarations: [BioModalPage]
})
export class BioModalPageModule {}
