import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.page.html',
  styleUrls: ['./notification-modal.page.scss'],
})
export class NotificationModalPage implements OnInit {

  @Input() type;
  response: string;

  constructor(private modalController: ModalController) { 
    this.response = this.type;
  }

  ngOnInit() {
    setTimeout(() => {
      this.modalController.dismiss();
    }, 3000);
  }

}
