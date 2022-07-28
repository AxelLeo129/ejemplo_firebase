import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingPage {

  languages = [];
  selected = '';
  loaded: boolean = false;
  slideOpts: any = {
    resistance: true,
    resistanceRatio: 0
  }

  constructor(private alertController: AlertController, private translate: TranslateService, private languageService: LanguageService, private change: ChangeDetectorRef) { }

  ionViewDidEnter() {
    setTimeout(() => {
      this.loaded = true;
      this.languages = this.languageService.getLenguages();
      this.change.detectChanges();
      this.setChecked();
      this.select('es', '1');
    }, 300);
  }

  select(lng, index) {
    this.languageService.setLanguage(lng, index);
  }

  setChecked() {
    this.selected = this.languageService.selected;
    this.languages.forEach((e: any) => {
      let lista = e.value.split(" ");
      if (lista[0] == this.selected) {
        e.checked = true;
      }
    });
    this.change.detectChanges();
  }

  async presentAlertRadio() {
    const alert = await this.alertController.create({
      header: this.translate.instant('LANGUAGEMODAL.Title'),
      inputs: this.languages,
      buttons: [
        {
          text: this.translate.instant('ALERT.button'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translate.instant('ALERT.button1'),
          handler: (data: string = 'es 1') => {
            let lista: any = data.split(" ");
            lista[1] = parseInt(lista[1]);
            this.select(lista[0], lista[1])
          }
        }
      ]
    });

    await alert.present();
  }

}
