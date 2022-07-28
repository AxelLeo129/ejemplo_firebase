import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LibraryListPageRoutingModule } from './library-list-routing.module';

import { LibraryListPage } from './library-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { VideoModalPageModule } from 'src/app/components/video-modal/video-modal.module';
import { VideoModalPage } from 'src/app/components/video-modal/video-modal.page';

@NgModule({
  entryComponents: [
    VideoModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    LibraryListPageRoutingModule,
    VideoModalPageModule
  ],
  declarations: [LibraryListPage]
})
export class LibraryListPageModule {}
