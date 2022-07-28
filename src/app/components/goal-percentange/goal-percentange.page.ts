import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-goal-percentange',
  templateUrl: './goal-percentange.page.html',
  styleUrls: ['./goal-percentange.page.scss'],
})
export class GoalPercentangePage implements OnInit {

  @Input() item;

  constructor(private modalController: ModalController, private progressService: ProgressService) { }

  ngOnInit() {
  }

  cancel(){
    this.modalController.dismiss();
  }

  update(value: number){
    let obj = {
      id: this.item.id,
      fecha_creacion: this.item.fecha_creacion1,
      fecha_cumplimiento: this.item.fecha_cumplimiento1,
      nivel_terminado: value,
      texto: this.item.texto,
      usuario: this.item.usuario
    }
    this.progressService.updateGoal(obj);
    this.modalController.dismiss();
  }

}
