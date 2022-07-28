import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagePopoverPage } from '../language-popover/language-popover.page';
import { LanguagePopoverPageModule } from '../language-popover/language-popover.module';
import { TemsPoliciesModalPageModule } from '../components/tems-policies-modal/tems-policies-modal.module';
import { TemsPoliciesModalPage } from '../components/tems-policies-modal/tems-policies-modal.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    TranslateModule,
    LanguagePopoverPageModule,
    TemsPoliciesModalPageModule
  ],
  entryComponents: [
    LanguagePopoverPage,
    TemsPoliciesModalPage
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
