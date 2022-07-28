import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponsesHistoryPage } from './responses-history.page';

const routes: Routes = [
  {
    path: '',
    component: ResponsesHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResponsesHistoryPageRoutingModule {}
