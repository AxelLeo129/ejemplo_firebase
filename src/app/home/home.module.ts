import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { TranslateModule } from '@ngx-translate/core';
import { EmotionTrackerComponent } from '../components/emotion-tracker/emotion-tracker.component';
import { NewOnboardingPage } from '../components/new-onboarding/new-onboarding.page';
import { NewOnboardingPageModule } from '../components/new-onboarding/new-onboarding.module';

@NgModule({
  entryComponents: [
    NewOnboardingPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    NewOnboardingPageModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
  ],
  declarations: [HomePage, EmotionTrackerComponent]
})
export class HomePageModule { }
