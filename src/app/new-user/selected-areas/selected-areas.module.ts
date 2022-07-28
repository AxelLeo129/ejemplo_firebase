import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectedAreasPageRoutingModule } from './selected-areas-routing.module';

import { SelectedAreasPage } from './selected-areas.page';
import { TranslateModule } from '@ngx-translate/core';
import { DescriptionSelectionPageModule } from 'src/app/components/description-selection/description-selection.module';
import { DescriptionSelectionPage } from 'src/app/components/description-selection/description-selection.page';
import { AreaOptionsSelectedModalPageModule } from 'src/app/components/area-options-selected-modal/area-options-selected-modal.module';
import { AreaOptionsSelectedModalPage } from 'src/app/components/area-options-selected-modal/area-options-selected-modal.page';

@NgModule({
  entryComponents: [
    DescriptionSelectionPage,
    AreaOptionsSelectedModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectedAreasPageRoutingModule,
    TranslateModule,
    DescriptionSelectionPageModule,
    AreaOptionsSelectedModalPageModule
  ],
  declarations: [SelectedAreasPage]
})
export class SelectedAreasPageModule {}
