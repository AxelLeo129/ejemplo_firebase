import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tems-policies-modal',
  templateUrl: './tems-policies-modal.page.html',
  styleUrls: ['./tems-policies-modal.page.scss'],
})
export class TemsPoliciesModalPage implements OnInit {

  @Input() tems;
  very: boolean;

  constructor(private modalController: ModalController, private change: ChangeDetectorRef) { }

  ngOnInit() {
    this.verify();
  }

  verify(){
    if(this.tems){
      this.very = this.tems;
    } else {
      this.very = false;
    }
    this.change.detectChanges();
  }

  closeModal(value: boolean){
    this.modalController.dismiss(value);
  }

}
