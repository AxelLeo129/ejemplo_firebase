import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TherapistAlreadyModalPage } from 'src/app/components/therapist-already-modal/therapist-already-modal.page';

@Component({
  selector: 'app-need-help',
  templateUrl: './need-help.page.html',
  styleUrls: ['./need-help.page.scss'],
})
export class NeedHelpPage implements OnInit {

  constructor(private navController: NavController, private modalController: ModalController) { }

  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: TherapistAlreadyModalPage,
      cssClass: 'with-top',
      swipeToClose: true,
    });

    await modal.present();

  }

  regresar(){
    this.navController.navigateRoot('/home');
  }

}
