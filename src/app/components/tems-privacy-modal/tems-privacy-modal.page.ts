import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tems-privacy-modal',
  templateUrl: './tems-privacy-modal.page.html',
  styleUrls: ['./tems-privacy-modal.page.scss'],
})
export class TemsPrivacyModalPage implements OnInit {

  @Input() tems;
  very: boolean;

  constructor(private modalController: ModalController, private change: ChangeDetectorRef) { }

  ngOnInit() {
    this.verify();
  }

  verify() {
    if (this.tems) {
      this.very = this.tems;
    } else {
      this.very = true;
    }
    this.change.detectChanges();
  }

  closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }

}
