import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-language-modal',
  templateUrl: './language-modal.page.html',
  styleUrls: ['./language-modal.page.scss'],
})
export class LanguageModalPage implements OnInit {

  languages = [];
  selected = '';

  constructor(private modalController: ModalController, private languageService: LanguageService) { }

  ngOnInit() {
    this.languages = this.languageService.getLenguages();
    this.selected = this.languageService.selected;
  }

  select(lng, index){
    this.languageService.setLanguage(lng, index);
    this.modalController.dismiss();
  }

  cancel(){
    this.modalController.dismiss();
  }

}
