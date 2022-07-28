import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  ChatService
} from './../../services/chat.service';
import {
  AuthService
} from './../../services/auth.service';
import {
  Observable,
  Subscription
} from 'rxjs';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  ActivatedRoute
} from '@angular/router';
import {
  IonContent,
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
  ActionSheetController
} from '@ionic/angular';
import {
  GeneralService
} from './../../services/general.service';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  ChatMenuModalPage
} from './../../components/chat-menu-modal/chat-menu-modal.page';
import {
  LanguageService
} from './../../services/language.service';
import {
  NotificationModalPage
} from './../../components/notification-modal/notification-modal.page';
import * as countdown from 'countdown';
import {
  MatchService
} from './../../services/match.service';

import {
  FileService
} from '../../services/file.service';
import {
  UtilitiesService
} from '../../services/utilities.service';

declare var require: any
const IntroJs = require("intro.js");

import {
  Media,
  MediaObject,
  MEDIA_STATUS
} from '@ionic-native/media/ngx';
import {
  File
} from '@ionic-native/file/ngx';
import {
  VibracionService
} from '../../services/vibracion.service';
import {
  VideoModalPage
} from './../../components/video-modal/video-modal.page';
import { ModalRateTherapistPage } from '../../components/modal-rate-therapist/modal-rate-therapist.page';

interface Time {
  minutes: number,
  seconds: number
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChatPage implements OnInit, OnDestroy {

  chat_subscription: Subscription;
  therapist_observer: Observable<any>;
  messagesObserver: Observable<any[]>;
  messagesObserver1: Observable<any[]>;
  uid: string;
  tid: string;
  user: any;
  therapist: any;
  messages: any[] = [];
  mensajes = [];
  new_message: string = "";
  loaded: boolean = false;
  loaded_null: boolean = false;
  class_text: string;
  id: string;
  last_id: string;
  disabled_scroll: boolean = true;
  @ViewChild(IonContent, {
    static: true
  }) content: IonContent;
  live_chat_subscription: Subscription;
  live_chat: any;
  doc_id: string;
  index: number;
  conversacion: any;
  timerId: number = null;
  time: Time = null;
  timerId1: number = null;
  time1: Time = null;
  call_subscription: Subscription;
  token_t: string;
  paquete_id: string;
  monto: number;
  subscripciones: Subscription[] = [];
  emergencia: any;
  setTimeOutFunction: any
  constructor(private matchService: MatchService, private toastController: ToastController, private languageService: LanguageService,
    public media: Media, private fileSystemService: File,
    private vibracionService: VibracionService,
    private files: FileService, private actionSheetController: ActionSheetController,
    private utilities: UtilitiesService,
    private modalController: ModalController, private translate: TranslateService, private alertController: AlertController, private loadingController: LoadingController, private generalService: GeneralService, private chatService: ChatService, private authService: AuthService, private change: ChangeDetectorRef, private http: HttpClient, private auth: AngularFireAuth, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
    this.class_text = this.route.snapshot.params.color;
  }

  ngOnInit() {
    this.getLanguage();
    this.getCurrentUser();
    this.getPaquete();
    this.getEmergencia();
    this.setTimeOutFunction = setTimeout(() => {
      let vistoChat = localStorage.getItem("chatMimento")
      if (!vistoChat) {
        this.introMethod();
        localStorage.setItem("chatMimento", "true")
      }
    }, 1000);
  }
  ionViewWillLeave() {
    if (this.setTimeOutFunction)
      clearTimeout(this.setTimeOutFunction)
    this.chat_subscription.unsubscribe();
    if (this.call_subscription)
      this.call_subscription.unsubscribe();
    this.subscripciones.forEach(subs => {
      subs.unsubscribe()
    });

    clearInterval(this.intervalo)

    if (this.intro)
      this.intro.exit()
  }
  ngOnDestroy() {

    localStorage.removeItem('sche');
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    if (this.timerId1) {
      clearInterval(this.timerId1);
    }
  }

  getPaquete() {
    this.generalService.getCollectionWhere1Promise('planes', 'emergencia', 'tipo').then((res: any) => {
      this.paquete_id = res.id;
      this.monto = res.precio;
    }).catch((err: any) => console.log(err));
  }

  getConversacion(id: string) {
    let conversacion_observable = this.generalService.getDoc('conversaciones', id);
    this.subscripciones.push(conversacion_observable.subscribe((res: any) => {
      this.conversacion = res;
      if (res.terminado == true) {
        this.class_text = 'chat-night';
        if (res.contador == 0) {
          console.log(0);
          this.conversacion.contador = 1;
          console.log(this.user);
          console.log(this.user.sesiones_disponibles);
          this.user.sesiones_disponibles = this.user.sesiones_disponibles - 1;
          this.generalService.updateDoc('conversaciones', this.conversacion, this.id).then(() => {
            this.authService.updateUser(this.uid, this.user);
            console.log(1);
            console.log(this.user);
            this.terminarChat(false, this.user.paquete, this.user.horario, 1);
          }).catch(err => console.log(err));
        }
      } else {
        let data = new Date();
        let dia = data.getDay();
        let dias = [1, 2, 3, 4, 5];
        if (dias.includes(dia)) {
          let schedule = localStorage.getItem('sche');
          if (schedule == null) {
            this.class_text = 'chat-day';
          }
        }
      }
      if (this.conversacion.nuevo_mensaje) {
        this.conversacion.nuevo_mensaje = false;
        this.start = 0;
        this.generalService.updateDoc('conversaciones', this.conversacion, this.id);
        this.getMessages1(this.id);
      }
      this.change.detectChanges();
    }));
  }

  async terminarChat(live: boolean, plan: string, horario: string, tipo: number) {
    console.log(2);
    let fecha = new Date();
    let day = fecha.getDay();
    let data = fecha.getTime();
    let objF = {
      terapeutaId: this.conversacion.terapeuta,
      horario,
      dia: day,
      tipo,
      tiempo: Math.round(this.conversacion.tiempo_transcurrido / 60),
      userId: this.uid,
      fecha: data,
      plan,
      live,
      sePaso: false
    }
    console.log(objF);
    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });
    this.http.post('https://us-central1-mimento-app.cloudfunctions.net/api/end_chat', objF, {
      headers: headers
    }).toPromise().then((res: any) => {
      console.log('success', res);
    }).catch(err => {
      console.log(err);
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
      //console.log('here', res);
      this.uid = res.uid;
      this.getCurrentUserDB(res.uid);
      this.getMessages1(this.id);
      this.getConversacion(this.id);
      this.getCard(this.uid);
    }).catch((err: any) => console.log(err));
  }

  getCard(id: string) {
    this.generalService.getDocPromise1('tarjetas', id).then(res => {
      this.token_t = res.token;
    }).catch((err: any) => console.log(err));
  }

  getCurrentUserDB(id: string) {
    this.authService.getUserPromiseDB(id).then(res => {
      this.user = res;
      let d = new Date()
      if (!this.user.fecha_calificacion) {
        this.actualizarTSUser(id)
      } else {
        let tiempo = (d.getTime() - this.user.fecha_calificacion) / (60 * 1000 * 60 * 24)
        if (tiempo >= 30) {
          this.presentModalRateApp()
        }
      }
      this.getTherapist(this.user.terapeuta);
      this.getLiveChat(this.uid + this.user.terapeuta);
    }).catch((err: any) => console.log(err));
  }
  actualizarTSUser(id: string) {
    let d = new Date()
    this.authService.updateUser(id, { fecha_calificacion: d.getTime() })
  }
  getLiveChat(id: string) {
    this.generalService.getDoc('cita_live', id).subscribe((res: any) => {
      if (!res) {
        return this.live_chat = false;
      }
      let fecha = new Date();
      let dia = fecha.getDay();
      this.live_chat = res;
      let day = this.live_chat.dia;
      let min = this.live_chat.hora.min;
      let max = this.live_chat.hora.max;
      if (dia == day && this.live_chat.terminado == false) {
        this.verifyStart(min, max, this.live_chat.hora_min_inicio, this.live_chat.hora_min_fin);
      }
      //console.log(this.live_chat)
    });
  }

  verifyStart(min: number, max: number, hora_min_inicio: any, hora_min_fin: any) {
    let fecha = new Date();
    let hora = fecha.getHours();
    let minutos = fecha.getMinutes();
    let hora_actual = ((hora * 3600) + (minutos * 60));
    if (hora_actual > min && hora_actual < max) {
      this.updateTime(hora_min_fin.hora, hora_min_fin.min);
    } else if (hora_actual < min) {
      this.timmerStart(hora_min_inicio, hora_min_fin);
    }
  }

  updateTime(max: number, min: number) {
    let start = localStorage.getItem('start');
    if (start == null) {
      this.presentToast();
      localStorage.setItem('start', '')
    }
    this.class_text = 'chat-day';
    this.change.detectChanges();
    let fecha = new Date();
    let year = fecha.getFullYear();
    let month = fecha.getMonth();
    let day = fecha.getDate();
    let fecha1 = new Date(year, month, day, max, min, 0, 0);
    console.log(fecha1);
    this.timerId1 = countdown(fecha1, (ts) => {
      let fecha2 = new Date();
      this.time = ts;
      if (fecha2 >= fecha1) {
        console.log(fecha2, fecha1);
        this.presentToast1();
        localStorage.removeItem('start');
        if (this.conversacion.terminado) {
          this.class_text = 'chat-night';
        } else {
          this.class_text = 'chat-day';
        }
        this.change.detectChanges();
        this.terminarChat(true, this.user.paquete, this.user.horario, 2);
        this.live_chat.terminado = true;
        this.generalService.updateDoc('cita_live', this.live_chat, (this.uid + this.user.terapeuta));
        clearInterval(this.timerId1);
      }
    });
  }

  timmerStart(hora_min_inicio: any, hora_min_fin: any) {
    let fecha = new Date();
    let year = fecha.getFullYear();
    let month = fecha.getMonth();
    let day = fecha.getDate();
    let fecha1 = new Date(year, month, day, hora_min_inicio.hora, hora_min_inicio.min, 0, 0);
    console.log(fecha1);
    this.timerId = countdown(fecha1, (ts) => {
      let fecha2 = new Date();
      this.time = ts;
      if (fecha2 >= fecha1) {
        clearInterval(this.timerId);
        this.updateTime(hora_min_fin.hora, hora_min_fin.min);
      }
    });
  }

  getTherapist(id: string) {
    this.chatService.getTherapistPromise(id).then(res => {
      this.therapist = res;
      this.change.detectChanges();
    }).catch(err => console.log(err));
  }

  getEmergencia() {
    this.generalService.getCollectionWhere1Promise('planes', 'emergencia', 'tipo').then((res: any) => {
      this.emergencia = res;
    }).catch((err: any) => console.log(err));
  }

  start: number = 0;
  end: number;
  async getMessages1(conversacion: string, ultimo_id: number = 0, event?) {
    let obj = {}
    if (this.start == 0) {
      obj = {
        conversacion: conversacion,
        limite: 50
      }
    } else {
      obj = {
        conversacion: conversacion,
        limite: 50,
        startAt: this.start
      }
    }
    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });
    //console.log(obj)
    this.chat_subscription = this.http.post('https://us-central1-mimento-app.cloudfunctions.net/mensajesAPI/leerMensajes', obj, {
      //this.chat_subscription = this.http.post('http://localhost:5000/mimento-app/us-central1/mensajesAPI/leerMensajes', obj, {
      headers: headers
    }).subscribe((res: any) => {
      //console.log(res.msgs)
      if (res.msgs.length != 0) {
        let reverso = res.msgs.reverse();
        this.last_id = reverso[0].id;

        this.start = res.msgs[0].data.fecha_creacion;

        //console.log("START", res.msgs[0].data)
        //console.log(ultimo_id)
        if (ultimo_id) {
          this.messages = [].concat(reverso, this.messages)
        } else {
          this.messages = reverso;
          this.content.scrollToBottom();
        }
        this.loaded = true;

        if (reverso.length < 50) {
          this.disabled_scroll = true;
        } else {
          this.disabled_scroll = false;
        }
        if (event) {
          event.target.complete();
        }
        //console.log(this.messages.length);
        this.change.detectChanges();
      } else {
        this.loaded_null = true;
        this.change.detectChanges();
        if (event) {
          event.target.complete();
          event.target.disabled = true;
        }
      }
    });
  }

  loadMore(event) {
    if (this.messages.length >= 50) {
      this.getMessages1(this.id, this.start, event);
    }
  }

  cancelRecording() {
    this.isRecording = false;
    this.timer = 0;
    this.isPlaying = false;
    if (this.file) {
      try {
        this.file.release();
      } catch (error) {
        console.log(error)
      }
    }
    this.change.detectChanges();
  }

  async setMessage(isAudio?: boolean) {
    let message: any;
    if (isAudio) {
      let s = await this.fileSystemService.readAsArrayBuffer(this.fileSystemService.dataDirectory, 'file.wav')
      let blob = new Blob([s], {
        type: "audio/wav"
      });

      let load = await this.utilities.createLoading()
      let url = await this.files.uploadBlobFile(blob, this.id, "" + (new Date().getTime()), this.uid, this.user.terapeuta);
      console.log(url)
      message = {
        conversacion: this.id,
        texto: this.index ? "Voice Message" : "Mensaje de voz",
        tipo: 'A',
        url_audio: url
      }
      this.isRecording = false;
      setTimeout(() => {
        load.dismiss()
      }, 300);
    } else {
      message = {
        conversacion: this.id,
        texto: this.new_message,
        tipo: 'M'
      }
    }

    let data = new Date();
    let token = await (await this.auth.currentUser).getIdToken(false);
    let lastMessage = this.new_message;
    this.new_message = '';
    this.change.detectChanges();
    const headers = new HttpHeaders({
      'authorization': token
    });
    this.http.post('https://us-central1-mimento-app.cloudfunctions.net/mensajesAPI/crearMensaje?conversacion', message, {
      headers: headers
    }).toPromise().then((res: any) => {
      //console.log(res);
      this.conversacion.nuevo_mensaje = true;
      this.conversacion.fecha_ultima_conversacion = data.getTime();
      this.conversacion.notificaciones = this.conversacion.notificaciones + 1;
      this.conversacion.lastMessage = lastMessage;
      this.generalService.updateDoc('conversaciones', this.conversacion, this.id);
      //console.log('save');
      //this.messages = [];
      this.start = 0;
      this.getMessages1(this.id);
    });
  }

  async presentAlertConfirm() {
    this.vibracionService.vibrarImpacto();
    const alert = await this.alertController.create({
      header: this.translate.instant('ALERTCARD.header'),
      message: this.translate.instant('ALERTCARD.msg2'),
      buttons: [{
        text: this.translate.instant('ALERTCARD.Button'),
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: this.translate.instant('ALERTCARD.Button1'),
        handler: () => {
          this.solicitarSesion();
        }
      }]
    });

    await alert.present();
  }

  async solicitarSesion() {
    this.presentLoading();
    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });
    let fecha = new Date();
    let hora = fecha.getHours();
    let objE = {
      horario: {
        min: hora,
        max: (hora + 1)
      },
      dia: fecha.getTime()
    }
    console.log(objE);
    this.http.post('https://us-central1-mimento-app.cloudfunctions.net/api/emergency_filter', objE, {
      headers: headers
    }).toPromise().then((res: any) => {
      console.log(res);
      if (res.terapeutas.length == 0) {
        this.loadingController.dismiss();
        this.presentAlert1();
        return
      }
      this.doc_id = res.terapeutas[0].uid;
      let doctor_name = ' ' + res.terapeutas[0].nombre_publico;
      let objE = {
        user: this.uid,
        therapist: this.doc_id,
        estado: 'activo',
        fecha: fecha.getTime()
      };
      this.presentAlert(res.terapeutas[0].telefono, doctor_name, objE);
      this.loadingController.dismiss();
    }).catch(err => {
      console.log(err);
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('LOADING.msg'),
    });
    await loading.present();
  }

  async presentAlert1() {
    const alert = await this.alertController.create({
      header: this.translate.instant('ALERTCARD.header'),
      message: this.translate.instant('ALERTCARD.error1'),
      buttons: [this.translate.instant('ALERTCARD.Button1')]
    });

    await alert.present();
  }

  async presentAlert(phone: string, name: string, objE: any) {
    const alert = await this.alertController.create({
      header: name,
      subHeader: this.translate.instant('ALERTCARD.subHeader'),
      message: this.translate.instant('ALERTCARD.msg3'),
      buttons: [{
        text: this.translate.instant('ALERTCARD.Button'),
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: this.translate.instant('ALERTCARD.Button2'),
        handler: () => {
          this.call(phone, objE);
        }
      }]
    });
    await alert.present();
  }

  async call(phone: string, objE: any) {
    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });
    this.generalService.getDocPromise('terapeutas', this.doc_id).then((res: any) => {
      let doc = res.data();
      doc.atiende_emergencia = false;
      doc.paciente = this.user.nombre;
      this.generalService.updateDoc('terapeutas', doc, this.doc_id).then(() => {
        this.generalService.saveDocWithoutAlert('llamada_emergencia', objE, (this.uid + this.doc_id)).then(() => {
          window.open(phone, "_system");
          let call_observable = this.generalService.getDoc('terapeutas', this.doc_id);
          this.call_subscription = call_observable.subscribe((res: any) => {
            if (res.atiende_emergencia == true) {
              objE.estado = 'finalizado';
              this.generalService.updateDoc('llamada_emergencia', objE, this.id).then(() => {
                let objPa = {
                  token: this.token_t,
                  currency: "GTQ",
                  amount: this.monto.toString(),
                  uid: this.uid,
                  idPaquete: this.paquete_id,
                  regalo: false,
                  emergencia: true
                }
                this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/pay_card', objPa, {
                  headers: headers
                }).toPromise().then(() => {
                  if (res.error) {
                    let fecha = new Date();
                    let objPP = {
                      monto: this.emergencia[0].precio.toString(),
                      fecha,
                      user: this.uid,
                      terapeuta: objE.therapist,
                      plan: this.emergencia[0].id
                    }
                    this.generalService.saveDocWithoutAlert('pagos_pendientes', objPP, this.uid).then(() => {
                      this.presentModal1('denied');
                    }).catch(err => {
                      console.log(err);
                      this.presentModal1('denied');
                    });
                  } else {
                    this.presentModal1('success');
                  }
                }).catch(err => {
                  console.log(err);
                  let fecha = new Date();
                  let objPP = {
                    monto: this.emergencia[0].precio.toString(),
                    fecha,
                    user: this.uid,
                    terapeuta: objE.therapist,
                    plan: this.emergencia[0].id
                  }
                  this.generalService.saveDocWithoutAlert('pagos_pendientes', objPP, this.uid).then(() => {
                    this.presentModal1('denied');
                  }).catch(err => {
                    console.log(err);
                    this.presentModal1('denied');
                  });
                });
              }).catch((err) => {
                console.log(err);
              })
            }
          });
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    }).catch(err => {
      console.log(err);
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ChatMenuModalPage,
      componentProps: {
        live: this.live_chat,
        therapist_id: this.user.terapeuta,
        therapist_name: this.therapist.nombre_publico,
        therapist_tratamiento: "", //this.therapist.tratamiento,
        especialidad: this.therapist.especializacion[this.index],
        id_paquete: this.user.paquete
      },
      swipeToClose: true,
      cssClass: 'with-top'
    });

    await modal.present();

  }

  async presentModal1(type: string) {
    const modal = await this.modalController.create({
      component: NotificationModalPage,
      cssClass: 'with-top',
      swipeToClose: true,
      componentProps: [
        type
      ]
    });

    await modal.present();

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.translate.instant('CHAT.Toast_msg'),
      duration: 2000
    });
    toast.present();
  }

  async presentToast1() {
    const toast = await this.toastController.create({
      message: this.translate.instant('CHAT.Toast_msg1'),
      duration: 2000
    });
    toast.present();
  }

  intro;
  realClassChat: string
  introMethod() {
    // import IntroJS
    this.intro = IntroJs();
    console.log("inside intro.js");
    this.intro.setOptions({
      steps: [{
        intro: this.translate.instant("TUTOCHAT.step1")
      },
      {
        element: "#step2",
        intro: this.translate.instant("TUTOCHAT.step2")
      },
      {
        element: "#step3",
        intro: this.translate.instant("TUTOCHAT.step3")
      },
      {
        element: "#step4",
        intro: this.translate.instant("TUTOCHAT.step4")
      },
      {
        intro: this.translate.instant("TUTOCHAT.step5")
      },
      {
        intro: this.translate.instant("TUTOCHAT.step6")
      },
      ],
      showProgress: true,
      skipLabel: this.translate.instant("TUTOCHAT.skip"),
      doneLabel: this.translate.instant("TUTOCHAT.done"),
      nextLabel: this.translate.instant("TUTOCHAT.next"),
      prevLabel: this.translate.instant("TUTOCHAT.prev"),
      overlayOpacity: "0.8"
    });
    this.realClassChat = this.class_text;

    this.intro.onbeforechange((t) => {
      if (this.intro._currentStep === 4)
        this.class_text = 'chat-day';
      if (this.intro._currentStep === 5)
        this.class_text = 'chat-night';
    });
    this.intro.onbeforeexit(() => {
      this.class_text = this.realClassChat;
    })
    this.intro.start();
  }

  isRecording: boolean = false;
  file: MediaObject;
  timer: number;
  canReproduce: boolean = false;
  intervalo: any;
  isPlaying: boolean = false;
  startRecord() {
    this.isRecording = true;
    this.timer = 0;
    this.isPlaying = false;
    if (this.file) {
      try {
        this.file.release();
      } catch (error) {
        console.log(error)
      }
    }

    if (this.fileSystemService && this.fileSystemService.createFile)
      this.fileSystemService.createFile(this.fileSystemService.dataDirectory, 'file.wav', true).then(() => {
        this.file = this.media.create(this.fileSystemService.dataDirectory.replace(/^file:\/\//, '') + 'file.wav');
        // to listen to plugin events:
        this.intervalo = setInterval(() => {
          this.timer += 1
        }, 1000);
        this.file.onError.subscribe(error => {
          console.log('Error!', error)
          this.utilities.presentAlert(this.translate.instant("CHAT.NoAudioRecord_title"), this.translate.instant("CHAT.NoAudioRecord_label"))
          this.isRecording = false;
          this.isPlaying = false;
          clearInterval(this.intervalo);
          this.timer = 0;
        });
        this.file.startRecord();
      });
    else
      this.utilities.presentToast(2000, this.translate.instant("CHAT.NoAudioRecord_title"))
  }
  async enviarAudio() {
    const actionSheet = await this.actionSheetController.create({
      header: this.translate.instant("CHAT.SendVoiceNote"),
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      buttons: [{
        text: 'Enviar',
        handler: () => {
          this.setMessage(true);
        }
      }, {
        text: this.translate.instant("CHAT.RepAg"),
        handler: () => {
          this.reproducirCancion();
        }
      }, {
        text: this.translate.instant("ALERT.button"),
        role: 'destructive',
        handler: () => {
          this.cancelRecording();
        }
      }]
    });
    await actionSheet.present();
  }

  stopRecord() {
    this.isPlaying = false;
    clearInterval(this.intervalo);
    this.file.stopRecord();
    this.reproducirCancion().then(S => {

    })
  }
  reproducirCancion() {
    this.file.play();
    return new Promise(async (res, rej) => {
      let l = await this.utilities.createLoading(this.translate.instant("CHAT.Reproducing"));
      let s = this.file.onStatusUpdate.subscribe(status => {
        if (status === MEDIA_STATUS.STOPPED) {
          s.unsubscribe()
          l.dismiss();
          this.enviarAudio();
          res(true);
        }
      }); // fires when file status changes
    });
  }
  setMessageAudio() {
    this.isPlaying = false;
    clearInterval(this.intervalo);
    this.file.stopRecord();
    this.setMessage(true)
  }
  play() {
    if (this.isPlaying) {
      this.file.play()
    } else {
      this.file.pause();
    }
    this.file.seekTo(0)
    this.isPlaying = !this.isPlaying
  }

  async presentModal2(url_video: string) {
    const modal = await this.modalController.create({
      component: VideoModalPage,
      componentProps: {
        url_video
      }
    });

    await modal.present();

  }


  async presentModalRateApp() {
    const modal = await this.modalController.create({
      component: ModalRateTherapistPage,
      cssClass: 'with-top',
      componentProps: {
        usuario: this.uid,
        terapeuta: this.user ? this.user.terapeuta || "" : ""
      }
    });

    await modal.present();
    this.actualizarTSUser(this.uid)
  }
}