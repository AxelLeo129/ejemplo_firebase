import {
  Component,
  OnInit
} from '@angular/core';
import {
  ModalController,
  NavController,
  ToastController,
  AlertController
} from '@ionic/angular';
import {
  GeneralService
} from './../../services/general.service';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  AuthService
} from './../../services/auth.service';
import {
  LiveChatModalPage
} from '../live-chat-modal/live-chat-modal.page';
import {
  UtilitiesService
} from './../../services/utilities.service';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Component({
  selector: 'app-therapist-already-modal',
  templateUrl: './therapist-already-modal.page.html',
  styleUrls: ['./therapist-already-modal.page.scss'],
})
export class TherapistAlreadyModalPage implements OnInit {

  code: string;
  uid: string;
  id_previous_therapist: string;
  user: any;
  paquete: any;
  schedule: string;
  schedules: Array<any> = [];

  constructor(private auth: AngularFireAuth,
    private alertController: AlertController,
    private http: HttpClient, private utilitiesService: UtilitiesService, private authService: AuthService, private translate: TranslateService, private modalController: ModalController, private generalService: GeneralService, private navController: NavController, private toastController: ToastController) { }

  ngOnInit() {
    this.getUser();
    this.getShedules();
  }

  getUser() {
    this.authService.getCurrentUserPromise().then((res: any) => {
      this.uid = res.uid;
      this.getPreviosusTherapist(this.uid);
      this.getCurrentUserDB(this.uid);
    }).catch((err: any) => console.log(err));
  }

  getPreviosusTherapist(id: string) {
    this.authService.getUserPromiseDB(id).then((res: any) => {
      this.id_previous_therapist = res.terapeuta;
    }).catch((err: any) => console.log(err));
  }

  getCurrentUserDB(id: string) {
    this.authService.getUserPromiseDB(id).then((res: any) => {
      this.user = res;
      //console.log(this.user);
      this.id_previous_therapist = this.user.terapeuta;
      if (this.user.paquete) {
        this.getPaquete(this.user.paquete);
      }
    })
  }

  getShedules() {
    this.generalService.getCollectionPromise('horarios', "orden", "asc").then((res: any) => {
      this.schedules = res;
    }).catch((err: any) => console.log(err));
  }

  getPaquete(id: string) {
    this.generalService.getDocPromise1('planes', id).then((res: any) => {
      this.paquete = res;
    }).catch((err: any) => console.log(err));
  }

  async search() {
    if (!this.code) {
      const alert = await this.utilitiesService.presentAlert("Error", this.translate.instant('ALERT.msgCode'), this.translate.instant('PAYMENTNOTIFICATION.Button'))
      return
    } else if(!this.schedule) {
      const alert = await this.utilitiesService.presentAlert("Error", this.translate.instant('ALERT.msgSchedule'), this.translate.instant('PAYMENTNOTIFICATION.Button'))
      return
    }
    this.generalService.getDocPromise1('terapeutas', this.code).then((res: any) => {
      let temas = res.temas;
      if (res == false) {
        this.presentToast3();
      } else {
        this.generalService.getDocPromise1('terapeutas_horarios', this.code).then((res: any) => {
          let contador: number = 0;
          let there: boolean = false;
          do {
            if (this.schedules[this.schedule].id == res.horarios[contador].id) {
              if (res.horarios[contador].sesiones_actuales < res.horarios[contador].sesiones_max) {
                there = true;
                break;
              }
            }
            contador++;
          } while (contador < res.horarios.length);
          if (!there) {
            this.presentToast3();
          } else {
            this.match(this.schedules[this.schedule], temas);
          }
        }).catch((err: any) => console.log(err));
      }
    }).catch((err: any) => {
      console.log(err);
    });
  }

  async match(horario: any, themes: any) {
    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });
    let subs = JSON.parse(localStorage.getItem('The'));
    if (subs) {
      this.utilitiesService.createLoading();
      console.log(this.user, (this.user.id + this.user.terapeuta));
      this.generalService.getDocPromise1('conversaciones', (this.user.id + this.user.terapeuta)).then((res: any) => {
        console.log(res);
        if (horario.max_sufix == 'pm') {
          horario.maximo = horario.maximo + 12;
        }
        if (horario.min_sufix == 'pm') {
          horario.minimo = horario.minimo + 12;
        }
        let horario_json: any = {
          max: horario.maximo,
          min: horario.minimo
        };
        let fecha = new Date().getTime();
        console.log(horario_json)
        //console.log(this.user);
        this.user.terapeuta = this.code;
        this.user.horario = horario.id;
        this.authService.updateUser(this.uid, this.user);
        let temas_ids = res.temas;
        let objc = {
          creacion: fecha,
          terapeuta: this.code,
          usuario: this.uid,
          fecha_ultima_conversacion: fecha,
          tiempo_transcurrido: 0,
          nuevo_mensaje: false,
          terminado: false,
          nombre_usuario: this.user.nombre,
          notificaciones: 0,
          lastMessage: '',
          contador: 0,
          horario: horario_json,
          temas: temas_ids
        }
        let objM = {
          userId: this.uid,
          terapeutaId: this.code,
          horario: this.user.horario
        }

        //console.log(objM);
        this.http.post('https://us-central1-mimento-app.cloudfunctions.net/api/match', objM, {
          headers: headers
        }).toPromise().then(() => {
          if (this.paquete.permite_live_session == true) {
            console.log(this.id_previous_therapist);
            this.generalService.deleteDoc('cita_live', this.uid + this.id_previous_therapist).then((res: any) => {
              this.utilitiesService.dissmissLoading();
              console.log(res)
              this.presentModal(res.id, objc);
            });
          } else {
            this.generalService.saveChat(objc, this.uid + this.code).then((res: any) => {
              let schedule_verify = horario_json;
              let fecha = new Date();
              let day = fecha.getDay();
              let hora = fecha.getHours();
              let days_array = [1, 2, 3, 4, 5];
              if (days_array.includes(day)) {
                if (hora < schedule_verify.maximo && hora > schedule_verify.minimo) {
                  localStorage.removeItem('terapeutas');
                  localStorage.removeItem('schedule');
                  localStorage.removeItem('schedule1');
                  this.navController.navigateRoot('/chat/' + res.id + '/chat-day');
                  this.modalController.dismiss();
                  this.utilitiesService.dissmissLoading();
                  this.presentToast();
                } else {
                  localStorage.removeItem('terapeutas');
                  localStorage.removeItem('schedule');
                  localStorage.removeItem('schedule1');
                  this.navController.navigateRoot('/home');
                  this.modalController.dismiss();
                  this.utilitiesService.dissmissLoading();
                  this.presentToast();
                }
              } else {
                localStorage.removeItem('terapeutas');
                localStorage.removeItem('schedule');
                localStorage.removeItem('schedule1');
                this.navController.navigateRoot('/home');
                this.modalController.dismiss();
                this.utilitiesService.dissmissLoading();
                this.presentToast();
              }
            }).catch(err => {
              localStorage.removeItem('terapeutas');
              localStorage.removeItem('schedule');
              localStorage.removeItem('schedule1');
              this.navController.navigateRoot('/home');
              this.modalController.dismiss();
              this.utilitiesService.dissmissLoading();
            })
          }
        }).catch(err => console.log(err));
      });
    } else {
      let temas: any = {
        temas1: [],
        temas2: []
      };
      temas.temas1.push({
        id: themes[0]
      });
      temas.temas2.push({
        id: themes[1]
      });
      localStorage.setItem('areas', JSON.stringify(temas));
      localStorage.setItem('schedule1', JSON.stringify(horario));
      sessionStorage.setItem('rt', JSON.stringify(false));
      this.navController.navigateRoot('/select-subscription/' + this.code);
      this.modalController.dismiss();
    }
  }

  async presentToast3() {
    const toast = await this.toastController.create({
      message: this.translate.instant('THERAPISTALREADYMODAL.Error'),
      duration: 3000
    });
    toast.present();
  }

  async presentModal(id: string, objc: any) {
    const modal = await this.modalController.create({
      component: LiveChatModalPage,
      swipeToClose: true,
      componentProps: {
        tiempoMin: this.paquete.live_minutes,
        therapists: id,
        uid: this.uid
      },
      cssClass: 'with-top1'
    });

    await modal.present();

    const {
      data
    }: any = await modal.onDidDismiss();

    if (data) {
      this.utilitiesService.createLoading();
      this.generalService.saveChat(objc, this.uid + id).then((res: any) => {
        let schedule_verify = JSON.parse(localStorage.getItem('schedule1'));
        let fecha = new Date();
        let day = fecha.getDay();
        let hora = fecha.getHours();
        let days_array = [1, 2, 3, 4, 5];
        if (days_array.includes(day)) {
          if (hora < schedule_verify.maximo && hora > schedule_verify.minimo) {
            this.utilitiesService.dissmissLoading();
            localStorage.removeItem('terapeutas');
            localStorage.removeItem('schedule');
            localStorage.removeItem('schedule1');
            this.navController.navigateRoot('/chat/' + id + '/chat-day');
            this.modalController.dismiss();
            this.presentToast();
          } else {
            this.utilitiesService.dissmissLoading();
            localStorage.removeItem('terapeutas');
            localStorage.removeItem('schedule');
            localStorage.removeItem('schedule1');
            this.navController.navigateRoot('/home');
            this.modalController.dismiss();
            this.presentToast();
          }
        } else {
          this.utilitiesService.dissmissLoading();
          localStorage.removeItem('terapeutas');
          localStorage.removeItem('schedule');
          localStorage.removeItem('schedule1');
          this.navController.navigateRoot('/home');
          this.modalController.dismiss();
          this.presentToast();
        }
      }).catch(err => {
        console.log(err);
        this.utilitiesService.dissmissLoading();
        localStorage.removeItem('terapeutas');
        localStorage.removeItem('schedule');
        localStorage.removeItem('schedule1');
        this.modalController.dismiss();
        this.navController.navigateRoot('/home');
      })
    } else {
      this.presentToast1();
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.translate.instant('PAYMENTNOTIFICATION.Title2'),
      duration: 2000
    });
    toast.present();
  }

  async presentToast1() {
    const toast = await this.toastController.create({
      message: this.translate.instant('PAYMENTNOTIFICATION.Title1'),
      duration: 2000
    });
    toast.present();
  }

}