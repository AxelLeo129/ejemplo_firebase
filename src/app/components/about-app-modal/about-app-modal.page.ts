import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-about-app-modal',
  templateUrl: './about-app-modal.page.html',
  styleUrls: ['./about-app-modal.page.scss'],
})
export class AboutAppModalPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  regresar(){
    this.modalController.dismiss();
  }

}
