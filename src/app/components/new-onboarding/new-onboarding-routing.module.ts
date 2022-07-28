import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewOnboardingPage } from './new-onboarding.page';

const routes: Routes = [
  {
    path: '',
    component: NewOnboardingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewOnboardingPageRoutingModule {}
