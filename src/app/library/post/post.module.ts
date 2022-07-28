import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostPageRoutingModule } from './post-routing.module';

import { PostPage } from './post.page';
import { VideoModalPageModule } from 'src/app/components/video-modal/video-modal.module';
import { VideoModalPage } from 'src/app/components/video-modal/video-modal.page';

@NgModule({
  entryComponents: [
    VideoModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostPageRoutingModule,
    VideoModalPageModule
  ],
  declarations: [PostPage]
})
export class PostPageModule {}
