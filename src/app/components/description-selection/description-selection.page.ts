import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-description-selection',
  templateUrl: './description-selection.page.html',
  styleUrls: ['./description-selection.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionSelectionPage implements OnInit {

  @Input() item;
  @Input() index;

  tema: any = {
    titulo: '',
    description: ''
  }

  constructor(private modalController: ModalController, private change: ChangeDetectorRef) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.tema.titulo = this.item.titulo[this.index];
    this.tema.description = this.item.descripcion[this.index];
    this.change.detectChanges();
  }

  cancel(){
    this.modalController.dismiss();
  }

}
