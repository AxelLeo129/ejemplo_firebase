import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  AuthService
} from './../../services/auth.service';
import {
  NavController,
  AlertController,
  ToastController,
  ModalController
} from '@ionic/angular';
import {
  LanguageService
} from './../../services/language.service';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  GeneralService
} from './../../services/general.service';
import {
  LiveChatModalPage
} from './../../components/live-chat-modal/live-chat-modal.page';
import {
  VibracionService
} from '../../services/vibracion.service';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  HttpHeaders,
  HttpClient
} from '@angular/common/http';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-match-result',
  templateUrl: './match-result.page.html',
  styleUrls: ['./match-result.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchResultPage implements OnInit {

  uid: string;
  user: any;
  therapists: any;
  index: number;
  paquete: any;
  id_previous_therapist: string;

  constructor(
    private vibracionService: VibracionService,
    private modalController: ModalController,
    private auth: AngularFireAuth,
    private utilitiesService: UtilitiesService,
    private http: HttpClient,
    private toastController: ToastController, private generalService: GeneralService, private translate: TranslateService, private alertController: AlertController, private authService: AuthService, private change: ChangeDetectorRef, private navController: NavController, private languageService: LanguageService) {}

  ngOnInit() {
    console.log('Inicia');
    this.getLanguage();
    this.getUser();
    this.getTherapists();
  }

  getLanguage() {
    this.languageService.getType().then(res => {
      if (res) {
        this.index = parseInt(res);
        if(this.index == undefined){
          this.index = 1;
        }
      } else {
        this.index = 1;
      }
    });
    console.log(this.index);
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
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

  getCurrentUserDB(id: string) {
    this.authService.getUserPromiseDB(id).then((res: any) => {
      this.user = res;
      this.id_previous_therapist = this.user.terapeuta;
      if (this.user.paquete) {
        this.getPaquete(this.user.paquete);
      }
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

  getPaquete(id: string) {
    this.generalService.getDocPromiseAdvance('planes', id).then((res: any) => {
      this.paquete = res;
    }).catch((err: any) => console.log(err));
  }

  getTherapists() {
    let t = JSON.parse(localStorage.getItem('terapeutas'));
    this.therapists = t.terapeutas;
    this.therapists.forEach(element => {
      let dias_array = []
      if (element.dias_atencion) {
        element.dias_atencion.forEach(element => {
          if (element == 0) {
            element = this.translate.instant('MATCHRESULTS.Sunday')
          } else if (element == 1) {
            element = this.translate.instant('MATCHRESULTS.Monday')
          } else if (element == 2) {
            element = this.translate.instant('MATCHRESULTS.Tuesday')
          } else if (element == 3) {
            element = this.translate.instant('MATCHRESULTS.Wednesday')
          } else if (element == 4) {
            element = this.translate.instant('MATCHRESULTS.Thursday')
          } else if (element == 5) {
            element = this.translate.instant('MATCHRESULTS.Friday')
          } else if (element == 6) {
            element = this.translate.instant('MATCHRESULTS.Saturday')
          }
          dias_array.push(element);
        });
      }
      element.dias_array = dias_array;
    });
    this.change.detectChanges();
  }

  regresar() {
    this.navController.navigateRoot('/lets-match');
  }

  selectTherapist(id: string) {
    this.vibracionService.vibrarAlerta();
    let subs = JSON.parse(localStorage.getItem('The'));
    if (subs) {
      this.presentAlertConfirm(id);
    } else {
      this.navController.navigateRoot('/select-subscription/' + id);
    }
  }

  async changeTherapist(id: string) {
    this.utilitiesService.createLoading();
    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });
    this.vibracionService.vibrarAlerta();
    let fecha = new Date().getTime();
    let horario = JSON.parse(localStorage.getItem('schedule'));
    let horario_json = JSON.parse(localStorage.getItem('schedule1'));
    /*console.log(horario_json);
    console.log(horario);*/
    if (horario_json.min_sufix == 'pm') {
      horario_json.minimo = horario_json.minimo + 12;
    }
    if (horario_json.max_sufix == 'pm') {
      horario_json.maximo = horario_json.maximo + 12;
    }
    //console.log(this.user);
    this.user.horario = horario;
    this.authService.updateUser(this.uid, this.user);
    let get_temas = JSON.parse(localStorage.getItem('areas'));
    let temas_ids = [];
    get_temas.temas1.forEach(element => {
      temas_ids.push(element.id);
    });
    get_temas.temas2.forEach(element => {
      temas_ids.push(element.id);
    });
    let objc = {
      creacion: fecha,
      terapeuta: id,
      usuario: this.uid,
      fecha_ultima_conversacion: fecha,
      tiempo_transcurrido: 0,
      nuevo_mensaje: false,
      terminado: false,
      nombre_usuario: this.user.nombre,
      notificaciones: 0,
      lastMessage: '',
      contador: 0,
      horario: {
        min: horario_json.minimo,
        max: horario_json.maximo
      },
      temas: temas_ids
    }
    let objM = {
      userId: this.uid,
      terapeutaId: id,
      horario: horario
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
          this.presentModal(id, objc);
        });
      } else {
        this.generalService.saveChat(objc, this.uid + id).then((res: any) => {
          let schedule_verify = JSON.parse(localStorage.getItem('schedule1'));
          let fecha = new Date();
          let day = fecha.getDay();
          let hora = fecha.getHours();
          let days_array = [1, 2, 3, 4, 5];
          if (days_array.includes(day)) {
            if (hora < schedule_verify.maximo && hora > schedule_verify.minimo) {
              localStorage.removeItem('terapeutas');
              localStorage.removeItem('schedule');
              localStorage.removeItem('schedule1');
              this.navController.navigateRoot('/chat/' + id + '/chat-day');
              this.utilitiesService.dissmissLoading();
              this.presentToast();
            } else {
              localStorage.removeItem('terapeutas');
              localStorage.removeItem('schedule');
              localStorage.removeItem('schedule1');
              this.navController.navigateRoot('/home');
              this.utilitiesService.dissmissLoading();
              this.presentToast();
            }
          } else {
            localStorage.removeItem('terapeutas');
            localStorage.removeItem('schedule');
            localStorage.removeItem('schedule1');
            this.navController.navigateRoot('/home');
            this.utilitiesService.dissmissLoading();
            this.presentToast();
          }
        }).catch(err => {
          localStorage.removeItem('terapeutas');
          localStorage.removeItem('schedule');
          localStorage.removeItem('schedule1');
          this.navController.navigateRoot('/home');
          this.utilitiesService.dissmissLoading();
        })
      }
    }).catch(err => console.log(err));

  }

  async presentAlertConfirm(id: string) {
    const alert = await this.alertController.create({
      header: this.translate.instant('ALERT.header'),
      message: this.translate.instant('ALERT.msg4'),
      buttons: [{
        text: this.translate.instant('ALERT.button'),
        role: 'cancel',
        handler: () => {
          this.regresar();
        }
      }, {
        text: this.translate.instant('ALERT.button1'),
        handler: () => {
          this.changeTherapist(id);
        }
      }]
    });

    await alert.present();
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
            this.presentToast();
          } else {
            this.utilitiesService.dissmissLoading();
            localStorage.removeItem('terapeutas');
            localStorage.removeItem('schedule');
            localStorage.removeItem('schedule1');
            this.navController.navigateRoot('/home');
            this.presentToast();
          }
        } else {
          this.utilitiesService.dissmissLoading();
          localStorage.removeItem('terapeutas');
          localStorage.removeItem('schedule');
          localStorage.removeItem('schedule1');
          this.navController.navigateRoot('/home');
          this.presentToast();
        }
      }).catch(err => {
        console.log(err);
        this.utilitiesService.dissmissLoading();
        localStorage.removeItem('terapeutas');
        localStorage.removeItem('schedule');
        localStorage.removeItem('schedule1');
        this.navController.navigateRoot('/home');
      })
    } else {
      this.presentToast1();
    }
  }

}