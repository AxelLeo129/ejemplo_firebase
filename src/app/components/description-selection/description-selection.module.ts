import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescriptionSelectionPageRoutingModule } from './description-selection-routing.module';

import { DescriptionSelectionPage } from './description-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DescriptionSelectionPageRoutingModule
  ],
  declarations: [DescriptionSelectionPage]
})
export class DescriptionSelectionPageModule {}
