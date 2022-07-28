import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  ProgressService
} from './../../services/progress.service';
import {
  Observable, Subscription
} from 'rxjs';
import {
  ModalController, AlertController
} from '@ionic/angular';
import {
  GoalsModalPage
} from './../../components/goals-modal/goals-modal.page';
import {
  AuthService
} from './../../services/auth.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  GoalPercentangePage
} from './../../components/goal-percentange/goal-percentange.page';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
})
export class GoalsPage implements OnInit, OnDestroy {

  goal_tab: string = 'porcumplir';
  uid: string;
  user: any;
  min_date: any;
  max_date: any;
  items: Observable<any[]>;
  goals: any[] = [];
  exists: boolean = false;
  m: string;
  y: string;
  items1: any = {
    porcumplir: [],
    cumplidos: []
  };
  load: boolean = false;
  load1: boolean = false;
  date_string: string;
  date_m: any;
  date_y: any;
  placeholder: string;
  user_subscribe: Subscription;

  monthNames =
    ["Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"]

  constructor(private alertController: AlertController,
    private auth: AngularFireAuth,
    private change: ChangeDetectorRef, private translate: TranslateService, private progressService: ProgressService, private modalController: ModalController, private authService: AuthService, private route: ActivatedRoute) {
    this.m = this.route.snapshot.params.m;
    this.y = this.route.snapshot.params.y;
    this.min_date = new Date();
    this.max_date = new Date();
  }

  ngOnInit() {
    this.getDate();
    this.max_date = this.getDates();
    this.min_date = this.getDates1();
    this.getCurrentUser();
  }

  ngOnDestroy() {
    if (this.user_subscribe)
      this.user_subscribe.unsubscribe();
  }

  ionViewDidLeave() {

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

  getDate() {
    this.placeholder = this.translate.instant('EMOTIONTRACKER.Months.Month' + this.m);
    this.change.detectChanges();
  }

  getDates1() {
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
    obtener = fecha.getFullYear() + "-" + m + "-" + l;
    return obtener.toString();
  }

  getCurrentUser() {
    this.auth.currentUser.then(user => {
      try {
        this.uid = user.uid;
      } catch (err) {
        console.log(err);
      }
      this.getGoals(user.uid, this.m, this.y);
    });
  }

  getGoals(uid: string, mo: string, ye: string) {
    let items = null;
    items = this.progressService.getGoals(uid);
    items.subscribe((res: any) => {
      this.items1 = {
        porcumplir: [],
        cumplidos: []
      };
      res.forEach(element => {
        element.fecha_cumplimiento = element.fecha_cumplimiento.toLocaleDateString()
        element.fecha_creacion = element.fecha_creacion.toLocaleDateString();
        if (element.nivel_terminado == 100) {
          this.items1.cumplidos.push(element);
        } else {
          this.items1.porcumplir.push(element);
        }
      });
      if (this.items1.cumplidos.length == 0) {
        this.load1 = false;
      } else {
        this.load1 = true;
      }
      if (this.items1.porcumplir.length == 0) {
        this.load = false;
      } else {
        this.load = true;
      }
      //console.log(this.items1);
      this.change.detectChanges();
    })
  }

  changeSegment() {
    this.change.detectChanges();
  }

  getNewGoals() {
    let d = new Date(this.date_string);
    let m = (d.getMonth() + 1);
    let y = d.getFullYear();
    this.date_m = m.toString();
    this.date_y = y.toString();
    this.getGoals(this.uid, this.date_m, this.date_y);
  }

  async newGoal() {
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
    modal.onDidDismiss().then(s => {
      this.change.detectChanges()
    })
  }

  async editPercentage(item: any) {
    const modal = await this.modalController.create({
      component: GoalPercentangePage,
      componentProps: {
        item
      },
      swipeToClose: true,
    });

    await modal.present();
  }

  async deleteGoal(id: string) {
    const alert = await this.alertController.create({
      header: this.translate.instant('ALERT.header'),
      message: this.translate.instant('ALERT.msg3'),
      buttons: [
        {
          text: this.translate.instant('UTILITIESSERVICE.Ok'),
          handler: () => {
            this.progressService.deleteGoal(id);
          }
        }
      ]
    });

    await alert.present();
  }

}