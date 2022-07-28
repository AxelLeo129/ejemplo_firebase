import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibraryListPage } from './library-list.page';

const routes: Routes = [
  {
    path: '',
    component: LibraryListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryListPageRoutingModule {}
