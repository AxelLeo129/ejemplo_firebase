import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProgressService } from 'src/app/services/progress.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-goals-modal',
  templateUrl: './goals-modal.page.html',
  styleUrls: ['./goals-modal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalsModalPage implements OnInit {

  goalForm: FormGroup;
  @Input() min_date;
  @Input() max_date;
  @Input() uid;


  constructor(private modalController: ModalController, private progressService: ProgressService, private change: ChangeDetectorRef) {
    this.goalForm = this.createFormGroup();
  }

  ngOnInit() {
  }

  updateTemplate(){
    this.change.detectChanges();
  }

  cancel(){
    this.modalController.dismiss();
  }

  createFormGroup(){
    return new FormGroup({
      'text': new FormControl('', [Validators.required]),
      'date': new FormControl('', [Validators.required])
    })
  }

  setGoal(){
    let fecha_creacion = new Date();
    let fecha_cumplimiento = new Date(this.goalForm.value.date);
    
    let obj = {
      fecha_creacion: fecha_creacion,
      fecha_cumplimiento: fecha_cumplimiento,
      nivel_terminado: 0,
      texto: this.goalForm.value.text,
      usuario: this.uid
    }
    this.progressService.saveGoal(obj);
    this.cancel();
  }

  printConsole(){
    console.log('adsfasdf');
  }

  get text() { return this.goalForm.get('text'); }
  get date() { return this.goalForm.get('date'); }

}
