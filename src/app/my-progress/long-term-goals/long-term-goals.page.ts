import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  Observable
} from 'rxjs';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  ProgressService
} from 'src/app/services/progress.service';
import {
  ModalController,
  AlertController
} from '@ionic/angular';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  GoalsModalPage
} from 'src/app/components/goals-modal/goals-modal.page';

@Component({
  selector: 'app-long-term-goals',
  templateUrl: './long-term-goals.page.html',
  styleUrls: ['./long-term-goals.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LongTermGoalsPage implements OnInit {

  uid: string;
  user: any;
  items: Observable<any[]>;
  min_date: any;
  max_date: any;
  goals: any[] = [];
  exists: boolean = false;

  constructor(private change: ChangeDetectorRef, private authService: AuthService, private progressService: ProgressService, private modalController: ModalController, private translate: TranslateService, private alertController: AlertController) {
    this.min_date = new Date();
    this.max_date = new Date();
  }

  ngOnInit() {
    this.max_date = this.getDates();
    this.min_date = this.getDates1();
    this.getCurrentUser();
  }

  getDates() {
    let fecha = new Date();
    let obtener;
    let n = fecha.getDate();
    let o = (fecha.getMonth() + 1);
    let m = o.toString();
    let l = n.toString();
    if (l.length == 1) {
      l = "0" + l;
    }
    if (m.length == 1) {
      m = "0" + m;
    }
    obtener = (fecha.getFullYear() + 100) + "-" + m + "-" + l;
    return obtener.toString();
  }

  sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  getDates1() {
    let f = new Date();
    let fecha = this.sumarDias(f, 31);
    let obtener;
    let n = fecha.getDate();
    let o = (fecha.getMonth() + 1);
    let m = o.toString();
    let l = n.toString();
    if (l.length == 1) {
      l = "0" + l;
    }
    if (m.length == 1) {
      m = "0" + m;
    }
    obtener = fecha.getFullYear() + "-" + m + "-" + l;
    return obtener.toString();
  }

  getCurrentUser() {
    this.user = this.authService.getCurrentUser();
    this.user.subscribe(res => {
      try {
        this.uid = res.uid;
      } catch (err) {
        console.log(err);
      }
      this.getObjectives(res.uid);
    })
  }

  getObjectives(uid: string) {
    /*let date = new Date();
    let ld = this.sumarDias(date, 31);
    this.items = this.progressService.getObjectives(uid);
    this.items.subscribe(res => {
      this.goals = [];
      res.forEach(e => {
        if(e.fecha_cumplimiento >= ld){
          this.goals.push(e);
        }
      })
      if(this.goals.length > 0){
        this.exists = true;
      }else{
        this.exists = false;
      }
      this.change.detectChanges();
    })*/
  }

  updateGoal(item: any) {
    item.nivel_terminado = 1
    this.progressService.updateGoal(item);
  }

  deleteGoal(id: string) {
    this.progressService.deleteGoal(id);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: GoalsModalPage,
      componentProps: {
        uid: this.uid,
        max_date: this.max_date,
        min_date: this.min_date
      },
      swipeToClose: true,
    });

    await modal.present();

  }

  async presentAlertConfirm(tipo: number, param: any) {
    let message: any;
    if (tipo == 1) message = this.translate.instant('MODALGOALS.Update');
    else message = this.translate.instant('MODALGOALS.Delete');
    const alert = await this.alertController.create({
      message,
      buttons: [{
        text: this.translate.instant('MODALGOALS.Cancel'),
        role: 'cancel',
        cssClass: 'secondary'
      }, {
        text: this.translate.instant('MODALGOALS.Ok'),
        handler: () => {
          if (tipo == 1) {
            this.updateGoal(param);
          } else {
            this.deleteGoal(param);
          }
        }
      }]
    });

    await alert.present();
  }

}