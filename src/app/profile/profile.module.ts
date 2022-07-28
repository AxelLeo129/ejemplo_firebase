import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { TranslateModule } from '@ngx-translate/core';
import { ChangePaymentModalPage } from '../components/change-payment-modal/change-payment-modal.page';
import { ChangePaymentModalPageModule } from '../components/change-payment-modal/change-payment-modal.module';

import { TemsPoliciesModalPageModule } from '../components/tems-policies-modal/tems-policies-modal.module';
import { TemsPoliciesModalPage } from '../components/tems-policies-modal/tems-policies-modal.page';
import { TemsPrivacyModalPageModule } from '../components/tems-privacy-modal/tems-privacy-modal.module';
import { TemsPrivacyModalPage } from '../components/tems-privacy-modal/tems-privacy-modal.page';

import { AboutAppModalPageModule } from '../components/about-app-modal/about-app-modal.module';
import { AboutAppModalPage } from '../components/about-app-modal/about-app-modal.page';
import { ModalRateTherapistPage } from '../components/modal-rate-therapist/modal-rate-therapist.page';
import { ModalRateTherapistPageModule } from '../components/modal-rate-therapist/modal-rate-therapist.module';
import { PopoverChangeSubscriptionPage } from '../components/popover-change-subscription/popover-change-subscription.page';
import { PopoverChangeSubscriptionPageModule } from '../components/popover-change-subscription/popover-change-subscription.module';

@NgModule({
  entryComponents: [
    ChangePaymentModalPage,
    TemsPoliciesModalPage,
    TemsPrivacyModalPage,
    AboutAppModalPage,
    ModalRateTherapistPage,
    PopoverChangeSubscriptionPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    TranslateModule,
    ChangePaymentModalPageModule,
    TemsPoliciesModalPageModule,
    TemsPrivacyModalPageModule,
    AboutAppModalPageModule,
    ModalRateTherapistPageModule,
    PopoverChangeSubscriptionPageModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
