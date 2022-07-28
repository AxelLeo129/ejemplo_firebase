import {
  Component
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  NavController,
  AlertController
} from '@ionic/angular';
import {
  Subscription
} from 'rxjs';
import {
  AuthService
} from './../../services/auth.service';
import {
  GeneralService
} from './../../services/general.service';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  HttpHeaders,
  HttpClient
} from '@angular/common/http';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  VibracionService
} from '../../services/vibracion.service';

@Component({
  selector: 'app-payment-notification',
  templateUrl: './payment-notification.page.html',
  styleUrls: ['./payment-notification.page.scss'],
})
export class PaymentNotificationPage {

  response: string;
  id: string;
  uid: string;
  user: any;
  id_paquete: string;
  schedule: string;
  suscripciones: Subscription[] = [];
  conta: number = 0;

  constructor(
    private alertController: AlertController,
    private vibracionService: VibracionService,
    private translate: TranslateService, private http: HttpClient, private navController: NavController, private route: ActivatedRoute, private authService: AuthService, private generalService: GeneralService, private auth: AngularFireAuth) {
    this.response = this.route.snapshot.params.res;
    this.id_paquete = this.route.snapshot.params.id;
    this.id = this.route.snapshot.params.paquete;

  }

  ionViewDidEnter() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    console.log(-1)
    this.authService.getCurrentUserPromise().then((res: any) => {
      this.uid = res.uid;
      this.getCurrentUserDB(this.uid);
    })
  }

  async getCurrentUserDB(id: string) {
    this.authService.getUserPromiseDB(id).then((res: any) => {
      this.user = res;
      console.log(this.user);
      this.verifyResponse();
    });
  }

  async verifyResponse() {
    console.log(this.response);
    this.schedule = JSON.parse(localStorage.getItem('schedule'));
    let e = JSON.parse(localStorage.getItem('e'));
    let type = localStorage.getItem('emergency');
    //console.log(this.schedule);
    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });
    let fecha = new Date().getTime();
    if (e != null) {
      localStorage.removeItem('e');
      this.navController.navigateRoot('/home');
    } else {
      if (this.response == 'success') {
        console.log(2);
        if (type == 'true') {
          localStorage.removeItem('emergency');
          this.navController.navigateRoot('/home');
        } else {
          this.vibracionService.vibrarCorrecto();
          let schedule_verify = JSON.parse(localStorage.getItem('schedule1'));
          let get_temas = JSON.parse(localStorage.getItem('areas'));
          let child_name = JSON.parse(localStorage.getItem('child_name'));
          if (child_name == null) {
            child_name = '';
          }
          let temas_ids = [];
          get_temas.temas1.forEach(element => {
            temas_ids.push(element.id);
          });
          get_temas.temas2.forEach(element => {
            temas_ids.push(element.id);
          });
          if (schedule_verify.min_sufix == 'pm') {
            schedule_verify.minimo = schedule_verify.minimo + 12;
          }
          if (schedule_verify.max_sufix == 'pm') {
            schedule_verify.maximo = schedule_verify.maximo + 12;
          }
          let objc = {
            creacion: fecha,
            terapeuta: this.id,
            usuario: this.uid,
            fecha_ultima_conversacion: fecha,
            tiempo_transcurrido: 0,
            nuevo_mensaje: false,
            terminado: false,
            nombre_usuario: this.user.nombre,
            notificaciones: 0,
            lastMessage: '',
            contador: 0,
            temas: temas_ids,
            horario: {
              min: schedule_verify.minimo,
              max: schedule_verify.maximo
            },
            child_name
          }
          console.log(objc);
          let id = this.uid + this.id;
          this.user.terapeuta = this.id;
          this.user.paquete = this.id_paquete;
          this.user.subscrito = true;
          let days = localStorage.getItem('able_days');
          let vigency = localStorage.getItem('vigency_days');
          //console.log(days);
          this.user.sesiones_disponibles = parseInt(days);
          this.user.dias_disponibles = parseInt(vigency);
          this.user.horario = this.schedule;
          this.user.dias_corte = 7;
          this.authService.updateUser(this.uid, this.user).then((res) => {
            console.log(res)
          }).catch(res => console.log(res));
          let objM = {
            userId: this.uid,
            terapeutaId: this.id,
            horario: this.schedule
          }
          console.log(objM);
          this.http.post('https://us-central1-mimento-app.cloudfunctions.net/api/match', objM, {
            headers: headers
          }).toPromise().then(() => {
            this.generalService.saveChat(objc, id).then((res: any) => {
              let fecha = new Date();
              let day = fecha.getDay();
              let hora = fecha.getHours();
              let days_array = [1, 2, 3, 4, 5];
              if (days_array.includes(day)) {
                if (hora < schedule_verify.maximo && hora > schedule_verify.minimo) {
                  localStorage.removeItem('terapeutas');
                  localStorage.removeItem('schedule');
                  localStorage.removeItem('schedule1');
                  localStorage.removeItem('able_days');
                  localStorage.removeItem('child_name');
                  this.navController.navigateRoot('/chat/' + id + '/chat-day');
                } else {
                  localStorage.removeItem('terapeutas');
                  localStorage.removeItem('schedule');
                  localStorage.removeItem('schedule1');
                  localStorage.removeItem('able_days');
                  localStorage.removeItem('child_name');
                  this.presentAlert();
                  this.navController.navigateRoot('/home');
                }
              } else {
                localStorage.removeItem('terapeutas');
                localStorage.removeItem('schedule');
                localStorage.removeItem('schedule1');
                localStorage.removeItem('able_days');
                localStorage.removeItem('child_name');
                this.presentAlert();
                this.navController.navigateRoot('/home');
              }
            }).catch(err => {
              localStorage.removeItem('terapeutas');
              localStorage.removeItem('schedule');
              localStorage.removeItem('schedule1');
              localStorage.removeItem('able_days');
              localStorage.removeItem('child_name');
              this.navController.navigateRoot('/home');
            })
          }).catch(err => console.log(err));
        }
      } else {
        this.vibracionService.vibrarIncorrecto();
        setTimeout(() => {
          this.generalService.deleteDoc('cita_live', (this.uid + this.id)).then(() => {
            this.navController.navigateRoot('/home');
          }).catch(err => {
            console.log(err);
            this.navController.navigateRoot('/home');
          })
        }, 3000);
      }
    }

  }

  chat() {
    this.navController.navigateRoot(['/chat']);
  }

  async presentAlert() {
    this.conta = this.conta + 1;
    console.log(this.conta);
    const alert = await this.alertController.create({
      message: this.translate.instant('PAYMENTNOTIFICATION.Title2_part1') + this.translate.instant('PAYMENTNOTIFICATION.Title2_part2'),
      buttons: [this.translate.instant('PAYMENTNOTIFICATION.Button')]
    });

    await alert.present();
  }

}