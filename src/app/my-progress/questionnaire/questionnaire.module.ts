import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestionnairePageRoutingModule } from './questionnaire-routing.module';

import { QuestionnairePage } from './questionnaire.page';
import { TranslateModule } from '@ngx-translate/core';
import { Ng5SliderModule } from 'ng5-slider';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuestionnairePageRoutingModule,
    TranslateModule,
    Ng5SliderModule
  ],
  declarations: [QuestionnairePage]
})
export class QuestionnairePageModule {}
