import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ModalController, IonSlides, NavController } from '@ionic/angular';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-exercise-modal',
  templateUrl: './exercise-modal.page.html',
  styleUrls: ['./exercise-modal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseModalPage implements OnInit {

  @Input() UserData;
  @Input() ejercicio;
  @Input() data_res;
  @Input() questions;
  @Input() index;
  nombre_usuario: string;
  data_save: any;
  exercise: any;
  respuestas: any;
  indice: number;
  fecha_realizacion: any;
  @ViewChild('slides', {
    static: true
  }) slides: IonSlides;
  options: AnimationOptions;

  constructor(private modalController: ModalController, private change: ChangeDetectorRef, private navController: NavController) {
    this.fecha_realizacion = new Date().getTime();
    this.options = {
      path: './assets/lottie/felicitaciones.json'
    }
  }

  ngOnInit() {
    this.slides.lockSwipes(true);
    this.getData();
  }

  getData(){
    this.indice = this.index;
    this.nombre_usuario = this.UserData.nombre;
    this.data_save = this.data_res;
    this.exercise = this.ejercicio;
    this.respuestas = this.questions;
    this.change.detectChanges();
  }

  goHome(){
    this.modalController.dismiss(false);
    this.navController.navigateRoot('/ejercicios/principales/ejercicios');    
  }

  history(){
    this.modalController.dismiss(false);
    this.navController.navigateRoot('/exercises-summary');    
  }

  empezar(){
    this.modalController.dismiss(true);
  }

  cancel(){
    this.modalController.dismiss(false);
    this.navController.navigateRoot('/ejercicios/principales/ejercicios');
  }

  vetResumen(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

}
