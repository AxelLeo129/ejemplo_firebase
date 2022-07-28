import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

const LNG_KEY = 'SELECTED_LENGUAGE';
const INDEX_KEY = 'SELECTED_INDEX';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  selected = '';
  public language_type: number;

  constructor(private translate: TranslateService, private storage: Storage) { }

  setInitialAppLanguage() {
    let lenguage = this.translate.getBrowserLang();
    //this.translate.setDefaultLang(lenguage);
    this.translate.setDefaultLang('es');


    this.storage.get(LNG_KEY).then(val => {
      if (val) {
        let index;
        if (val == 'en') {
          index = 0;
        } else {
          index = 1;
        }
        this.setLanguage(val, index);
      }
    });
  }

  getLenguages() {
    return [
      {
        name: 'English',
        type: 'radio',
        label: 'English',
        text: 'English',
        value: 'en 0',
        index: 0,
        checked: false
      },
      {
        name: 'Español',
        type: 'radio',
        text: 'Español',
        label: 'Español',
        value: 'es 1',
        index: 1,
        checked: false
      }
    ];
  }

  getType() {
    return this.storage.get(INDEX_KEY);
  }

  setLanguage(lng, index) {
    this.translate.use(lng);
    this.selected = lng;
    this.storage.set(LNG_KEY, lng);
    this.language_type = index;
    this.storage.set(INDEX_KEY, index);
  }

}
