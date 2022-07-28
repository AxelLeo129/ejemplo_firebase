import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmotionTrackerHistoryPage } from './emotion-tracker-history.page';

const routes: Routes = [
  {
    path: '',
    component: EmotionTrackerHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmotionTrackerHistoryPageRoutingModule {}
