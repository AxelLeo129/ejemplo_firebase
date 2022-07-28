import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  GeneralService
} from '../services/general.service';
import {
  AuthService
} from '../services/auth.service';
import {
  Observable,
  Subscription
} from 'rxjs';

import {
  UtilitiesService
} from '../services/utilities.service';
import {
  LanguageService
} from '../services/language.service';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  Router
} from '@angular/router';
import {
  ModalController
} from '@ionic/angular';
import {
  BioModalPage
} from '../components/bio-modal/bio-modal.page';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  NewOnboardingPage
} from "./../components/new-onboarding/new-onboarding.page";
import {
  ModalRateTherapistPage
} from '../components/modal-rate-therapist/modal-rate-therapist.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit {

  public index: number;
  mood: number = 3;
  cards: any[] = [];
  uid: string;
  user_datos: any;
  public mood_title: string = '';
  live_chat: any;
  conversacion: any;
  paquete: any;
  //schedule: any;

  constructor(private auth: AngularFireAuth, private modalController: ModalController, private router: Router, private translate: TranslateService, private generalService: GeneralService, private utilityService: UtilitiesService, private change: ChangeDetectorRef, private languageService: LanguageService, private authService: AuthService) {
    this.mood_title = this.translate.instant('HOME.moods.fine');
  }

  ngOnInit() {
    //this.getToken();
    let tutorialMimentoInicio = localStorage.getItem("tutorialMimentoInicio");
    if (!tutorialMimentoInicio) {
      this.presentModalNewBoarding()
      localStorage.setItem("tutorialMimentoInicio", "true");
    } else {
      this.debePresentarBioModal()
    }
  }

  ionViewDidEnter() {
    this.getLanguage();
    this.getCurrentUser();
    this.getData();
  }

  async getToken() {
    let token = await (await this.auth.currentUser).getIdToken(false);
    console.log(token)
  }
  debePresentarBioModal() {
    let permission = localStorage.getItem('P');
    if (permission == 'true' || permission == null) {
      setTimeout(() => {
        this.presentModal();
      })
    }
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: BioModalPage,
      //swipeToClose: false,
      componentProps: {
        type: 'bio'
      },
      backdropDismiss: false
    });

    await modal.present();

  }
  async presentModalNewBoarding() {
    const modal = await this.modalController.create({
      component: NewOnboardingPage,
      swipeToClose: true,
      cssClass: 'with-top'
    });

    await modal.present();
    modal.onDidDismiss().then(s => {
      this.debePresentarBioModal()
    })
  }

  getLanguage() {
    this.languageService.getType().then(res => {
      if (res) {
        this.index = parseInt(res);
      } else {
        this.index = 0;
      }
    });
  }

  getCurrentUser() {
    this.authService.getCurrentUserPromise().then((res: any) => {
      this.uid = res.uid;
      this.getCurrentUserDB(res.uid);
    }).catch((err: any) => console.log(err));
  }

  getCurrentUserDB(id: string) {
    this.authService.getUserPromiseDB(id).then((res: any) => {
      this.user_datos = res;
      this.getLiveChat(this.uid + this.user_datos.terapeuta);
      this.getConversacion(this.uid + this.user_datos.terapeuta);
      if (this.user_datos && this.user_datos.paquete)
        this.getPaquete(this.user_datos.paquete);
      /*if (this.user_datos && this.user_datos.horario)
        this.getHorario(this.user_datos.horario);*/
      this.change.detectChanges();
      this.updateUserDB();
    }).catch((err: any) => console.log(err));
  }

  /*getHorario(id: string) {
    this.generalService.getDocPromiseAdvance('horarios', id).then((res: any) => {
      this.schedule = res;
      if (this.schedule.min_sufix == 'pm') {
        this.schedule.minimo = (12 + this.schedule.minimo);
      }
      if (this.schedule.max_sufix == 'pm') {
        this.schedule.maximo = (12 + this.schedule.maximo);
      }
      //console.log(this.schedule);
    }).catch((err: any) => console.log(err));
  }*/

  getLiveChat(id: string) {
    this.generalService.getDocPromise1('cita_live', id).then((res: any) => {
      this.live_chat = res;
    }).catch((err: any) => console.log(err));
  }

  getConversacion(id: string) {
    this.generalService.getDocPromise1('conversaciones', id).then((res: any) => {
      this.conversacion = res;
    }).catch((err: any) => console.log(err));
  }

  getPaquete(id: string) {
    this.generalService.getDocPromise1('planes', id).then((res: any) => {
      this.paquete = res;
    }).catch((err: any) => console.log(err));
  }

  updateUserDB() {
    this.user_datos.language = this.index;
    this.authService.updateUser(this.uid, this.user_datos);
  }

  updateConversacion(objC: any, id: string) {
    this.generalService.updateDoc('conversaciones', objC, id);
  }

  setMood() {
    let mt = this.setText()
    this.utilityService.presentAlertConfirm(this.translate.instant('HOME.Answer') + "  " + mt.toUpperCase(), this.translate.instant('HOME.Alert')).then(res => {
      if (res) {
        let fecha_hoy = new Date();
        this.generalService.saveDoc('moods', {
          mood: this.mood,
          fecha_creacion: fecha_hoy,
          uid: this.uid
        })
      }
    }).catch(err => console.log(err));
  }

  setText() {
    switch (this.mood) {
      case 1:
        this.mood_title = this.translate.instant('HOME.moods.angry');
        break;
      case 2:
        this.mood_title = this.translate.instant('HOME.moods.sad');;
        break;
      case 3:
        this.mood_title = this.translate.instant('HOME.moods.fine');
        break;
      case 4:
        this.mood_title = this.translate.instant('HOME.moods.sad');
        break;
      case 5:
        this.mood_title = this.translate.instant('HOME.moods.angry');
      case 6:
        this.mood_title = this.translate.instant('HOME.moods.happy');
        break;
      default:
        break;
    }
    return this.mood_title;
  }

  getData() {
    this.generalService.getCatalogo('principal').then((s: any) => {
      this.cards = s;
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

  validateRouter(route: string) {
    if (route == '/need-help') {
      //console.log(this.user_datos.subscrito);
      if (this.user_datos.subscrito == true) {
        if (this.user_datos.terapeuta || this.user_datos.terapeuta != '') {
          let fecha = new Date();
          let day = fecha.getDay();
          let hour = fecha.getHours();
          let minutes = fecha.getMinutes();
          let start_time = (hour * 3600) + (minutes * 60);
          if ((day == this.live_chat.dia) && (start_time >= this.live_chat.hora.min && start_time <= this.live_chat.hora.max)) {
            this.router.navigate(['/chat/' + this.uid + this.user_datos.terapeuta + '/chat-day']);
          } else {
            let data = new Date();
            let dia = data.getDay();
            let dias = [1, 2, 3, 4, 5];
            let hora = data.getHours();
            if (dias.includes(dia)) {
              //console.log(this.schedule, hora, hora >= this.schedule.minimo && hora <= this.schedule.maximo);
              //if (hora >= this.schedule.minimo && hora <= this.schedule.maximo) {
                if (hora >= this.conversacion.horario.min && hora <= this.conversacion.horario.max) {
                if (this.user_datos.sesiones_disponibles > 0) {
                  //change verificar
                  let fecha = new Date();
                  let year = fecha.getFullYear();
                  let month = (fecha.getMonth() + 1);
                  let day = fecha.getDate();
                  let data = new Date(this.conversacion.fecha_ultima_conversacion);
                  let year1 = data.getFullYear();
                  let month1 = (data.getMonth() + 1);
                  let day1 = data.getDate();
                  if (year == year1 && month == month1 && day == day1) {
                    if (this.conversacion.tiempo_transcurrido < (this.paquete.minutos_dia * 60)) {
                      this.router.navigate(['/chat/' + this.uid + this.user_datos.terapeuta + '/chat-day']);
                    } else {
                      //console.log(this.conversacion.tiempo_transcurrido, this.paquete.minutos_dia)
                      this.conversacion.terminado = true;
                      this.updateConversacion(this.conversacion, (this.uid + this.user_datos.terapeuta));
                      this.router.navigate(['/chat/' + this.uid + this.user_datos.terapeuta + '/chat-night']);
                      //console.log(1);
                    }
                  } else {
                    this.conversacion.tiempo_transcurrido = 0;
                    this.conversacion.terminado = false;
                    this.conversacion.contador = 0;
                    this.conversacion.fecha_ultima_conversacion = fecha.getTime();
                    this.updateConversacion(this.conversacion, (this.uid + this.user_datos.terapeuta));
                    this.router.navigate(['/chat/' + this.uid + this.user_datos.terapeuta + '/chat-day']);
                  }
                } else {
                  this.conversacion.terminado = true;
                  this.updateConversacion(this.conversacion, (this.uid + this.user_datos.terapeuta));
                  this.router.navigate(['/chat/' + this.uid + this.user_datos.terapeuta + '/chat-night']);
                  //console.log(2);
                }
              } else {
                localStorage.setItem('sche', 'true');
                this.router.navigate(['/chat/' + this.uid + this.user_datos.terapeuta + '/chat-night']);
              }
            } else {
              this.router.navigate(['/chat/' + this.uid + this.user_datos.terapeuta + '/chat-night']);
            }
          }
        } else {
          localStorage.setItem('The', JSON.stringify(false));
          this.router.navigate([route])
        }
      } else {
        localStorage.setItem('The', JSON.stringify(false));
        this.router.navigate([route]);
      }
    } else {
      this.router.navigate([route])
    }
  }

}