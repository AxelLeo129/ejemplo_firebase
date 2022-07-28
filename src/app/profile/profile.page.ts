import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  AuthService
} from '../services/auth.service';
import {
  Subscription
} from 'rxjs';
import {
  NavController,
  ModalController,
  AlertController,
  LoadingController,
  ToastController,
  PopoverController
} from '@ionic/angular';
import {
  GeneralService
} from '../services/general.service';
import {
  LanguageService
} from '../services/language.service';
import {
  Router
} from '@angular/router';
import {
  ChangePaymentModalPage
} from '../components/change-payment-modal/change-payment-modal.page';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  TemsPoliciesModalPage
} from '../components/tems-policies-modal/tems-policies-modal.page';
import {
  TemsPrivacyModalPage
} from '../components/tems-privacy-modal/tems-privacy-modal.page';
import {
  AboutAppModalPage
} from '../components/about-app-modal/about-app-modal.page';
import {
  UtilitiesService
} from '../services/utilities.service';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  ModalRateTherapistPage
} from '../components/modal-rate-therapist/modal-rate-therapist.page';
import { PopoverChangeSubscriptionPage } from '../components/popover-change-subscription/popover-change-subscription.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage implements OnInit {

  user_data: any;
  uid: any;
  telefono: string;
  contacto_emergencia: string;
  relacion_emergencia: string;
  therapist: any;
  paquete: any;
  index: number;
  payment_method: any;
  doc_id: string;
  email_variable: string;
  call_subscription: Subscription;
  emergencia: any;
  conversacion: any;

  constructor(private toastController: ToastController,
    private utilities: UtilitiesService,
    private loadingController: LoadingController,
    private db: AngularFirestore,
    private popoverController: PopoverController,
    private translate: TranslateService, private alertController: AlertController, private auth: AngularFireAuth, private http: HttpClient, private modalController: ModalController, private router: Router, private authService: AuthService, private change: ChangeDetectorRef, private navController: NavController, private generalService: GeneralService, private languageService: LanguageService) { }

  ngOnInit() {
    localStorage.removeItem('The');
    this.getLanguage();
    this.getCurrentUser();
    this.getEmailVariable();
    this.getEmergencia();
  }

  getEmailVariable() {
    this.generalService.getDocPromise1('variables', 'correo_ayuda_información').then((res: any) => {
      this.email_variable = res.valor;
    }).catch((err) => console.log(err));
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

  signOut() {
    this.authService.logOut();
    localStorage.clear();
    this.navController.navigateRoot('/login');
  }

  getCurrentUser() {
    this.authService.getCurrentUserPromise().then(res => {
      this.uid = res.uid;
      this.getCurrentUserDB(res.uid);
    }).catch((err: any) => console.log(err));
  }

  getTherapist(id: string) {
    this.generalService.getDocPromise1('terapeutas', id).then((res: any) => {
      this.therapist = res;
      //console.log(this.therapist);
      this.change.detectChanges();
    });
  }

  getPlan(id: string) {
    this.generalService.getDocPromise1('planes', id).then((res: any) => {
      this.paquete = res;
      //console.log(this.paquete);
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

  getEmergencia() {
    this.generalService.getCollectionWhere1Promise('planes', 'emergencia', 'tipo').then((res: any) => {
      this.emergencia = res;
    }).catch((err: any) => console.log(err));
  }

  getEmergencyData() {
    //let emergency_observable = this.generalService.getCollectionWhere1('planes', )
  }

  getPaymentMethod(id: string) {
    this.generalService.getDocPromise1('tarjetas', id).then((res: any) => {
      this.payment_method = res;
      //console.log(this.payment_method);
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

  updateUser() {
    this.user_data.telefono = this.telefono;
    this.user_data.contacto_emergencia = this.contacto_emergencia;
    this.user_data.relacion_emergencia = this.relacion_emergencia;
    this.authService.updateUser(this.uid, this.user_data);
  }

  ionViewWillLeave() {
    if(this.call_subscription){
      this.call_subscription.unsubscribe();
    }
    try {
      if (this.modal && this.modal.dismiss)
        this.modal.dismiss()
    } catch (err) {
      console.log(err)
    }
  }

  getCurrentUserDB(id: string) {
    this.authService.getUserPromiseDB(id).then(res => {
      this.user_data = res;
      this.getConversacion(id + this.user_data.terapeuta)
      this.telefono = this.user_data.telefono || "";
      this.contacto_emergencia = this.user_data.contacto_emergencia || "";
      this.relacion_emergencia = this.user_data.relacion_emergencia || "";
      if (this.user_data.terapeuta) {
        this.getTherapist(this.user_data.terapeuta);
      } else {
        this.therapist = false;
      }
      if (this.user_data.paquete) {
        this.getPlan(this.user_data.paquete);
      } else {
        this.paquete = false;
      }
      this.getPaymentMethod(id);
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

  changeMembership() {
    localStorage.setItem('The', JSON.stringify(false));
    this.router.navigate(['/need-help']);
  }

  cambiarAreasInteres() {
    localStorage.setItem('The', JSON.stringify(false));
    localStorage.setItem("changeAreas", "s")
    this.router.navigate(['/need-help']);
  }

  changeTherapist() {
    localStorage.setItem('The', JSON.stringify(true));
    this.router.navigate(['/need-help']);
  }

  async presentModal() {
    this.modal = await this.modalController.create({
      component: ChangePaymentModalPage,
      componentProps: {
        token_card: this.payment_method.token
      },
      swipeToClose: true,
      cssClass: "with-top"
    });

    await this.modal.present();

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
      dia: fecha.getDay()
    }
    console.log(objE);
    this.http.post('https://us-central1-mimento-app.cloudfunctions.net/api/emergency_filter', objE, {
      headers: headers
    }).toPromise().then((res: any) => {
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
      this.generalService.updateDoc('terapeutas', doc, this.doc_id).then(() => {
        this.generalService.saveDocWithoutAlert('llamada_emergencia', objE, (this.uid + this.doc_id)).then(() => {
          window.open('tel:' + phone, "_system");
          let cont = 0;
          let call_observable = this.generalService.getDoc('terapeutas', objE.therapist);
          this.call_subscription = call_observable.subscribe((res: any) => {
            if (res.atiende_emergencia == true && cont == 0) {
              cont = 1;
              if (!this.payment_method) {
                this.presentModal32(objE.therapist);
              } else {
                let objPa = {
                  token: this.payment_method.token,
                  currency: "GTQ",
                  amount: this.emergencia[0].precio.toString(),
                  uid: this.uid,
                  idPaquete: this.emergencia[0].id,
                  regalo: false,
                  emergencia: true
                }
                let fecha = new Date().getTime();
                let dia = new Date().getDay();
                let objF = {
                  terapeutaId: this.doc_id,
                  horario: this.user_data.horario,
                  dia,
                  tipo: 3,
                  tiempo: 20,
                  userId: this.uid,
                  fecha,
                  plan: this.emergencia[0].id,
                  live: false,
                  sePaso: false
                }
                localStorage.setItem('e', '1');
                this.http.post('https://us-central1-mimento-app.cloudfunctions.net/api/end_chat', objF, {
                  headers: headers
                }).toPromise().then((res: any) => {
                  console.log(objPa);
                  this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/pay_card', objPa, {
                    headers: headers
                  }).toPromise().then((res: any) => {
                    this.loadingController.dismiss();
                    this.navController.navigateRoot('/payment-notification/success/' + this.emergencia[0].id + '/' + objE.therapist);
                  }).catch(err => {
                    this.loadingController.dismiss();
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
                      this.navController.navigateRoot('/payment-notification/denied/' + this.emergencia[0].id + '/' + objE.therapist);
                    }).catch((err) => {
                      console.log(err);
                      this.navController.navigateRoot('/payment-notification/denied/' + this.emergencia[0].id + '/' + objE.therapist);
                    });
                  });
                }).catch(err => {
                  this.loadingController.dismiss();
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
                    this.navController.navigateRoot('/payment-notification/denied/' + this.emergencia[0].id + '/' + objE.therapist);
                  }).catch((err) => {
                    console.log(err);
                    this.navController.navigateRoot('/payment-notification/denied/' + this.emergencia[0].id + '/' + objE.therapist);
                  });
                });
              }
            }
          })
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    }).catch(err => {
      console.log(err);
    });
  }

  async presentModal32(id1: string) {
    this.modal = await this.modalController.create({
      component: ChangePaymentModalPage,
      backdropDismiss: false,
      componentProps: {
        id1,
        idPaquete: this.emergencia[0].id,
        monto: this.emergencia[0].precio.toString()
      },
      cssClass: "with-top"
    });

    await this.modal.present();

  }

  async presentAlertConfirm() {
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

  async presentAlertConfirm3() {
    try {
      await this.utilities.quejaEtica()
      this.utilities.presentAlert(
        this.translate.instant('QUEJAS.DoneTitle'),
        this.translate.instant('QUEJAS.DoneMessage'))
    } catch (error) {
      console.log(error)
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('LOADING.msg'),
    });
    await loading.present();
  }

  async presentModal1() {
    this.modal = await this.modalController.create({
      component: TemsPoliciesModalPage,
      componentProps: {
        tems: false
      },
      swipeToClose: true,
      cssClass: 'with-top'
    });
    await this.modal.present();
  }
  async presentModal3() {
    this.modal = await this.modalController.create({
      component: TemsPrivacyModalPage,
      componentProps: {
        tems: false
      },
      swipeToClose: true,
      cssClass: 'with-top'
    });
    await this.modal.present();
  }

  async presentAlertConfirm1() {
    const alert = await this.alertController.create({
      header: this.translate.instant('PROFILE.Title_alert'),
      message: this.translate.instant('PROFILE.Description'),
      buttons: [{
        text: this.translate.instant('PROFILE.Button3'),
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          //console.log('Confirm Cancel: blah');
        }
      }, {
        text: this.translate.instant('PROFILE.Button2'),
        handler: () => {
          this.cancelSubscription();
        }
      }]
    });

    await alert.present();
  }

  cancelSubscription() {
    this.user_data.subscrito = false;
    this.user_data.paquete = null;
    this.user_data.cita_live = 0;
    this.user_data.sesiones_disponibles = 0;
    this.user_data.dias_corte = 0;
    this.user_data.dias_disponibles = 0;
    this.generalService.updateDoc('usuarios', this.user_data, this.uid).then(() => {
      this.presentToast(true);
    }).catch((err) => {
      console.log(err);
      this.presentToast(false);
    });
  }

  async presentToast(very: boolean) {
    let message = '';
    if (very) {
      message = this.translate.instant('PROFILE.Message');
    } else {
      message = this.translate.instant('PROFILE.Error');
    }

    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async presentModal2() {
    this.modal = await this.modalController.create({
      component: AboutAppModalPage,
      cssClass: 'with-top'
    });
    await this.modal.present();
  }

  shareApp() {
    let newVariable: any;

    newVariable = window.navigator;

    if (newVariable && newVariable.share) {
      newVariable.share({
        title: 'Mimento',
        text: this.translate.instant('PROFILE.Share_description'),
        url: 'http://www.mimentoapp.com',
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      alert('share not supported');
    }
  }

  async presentAlertConfirm2() {
    const alert = await this.alertController.create({
      header: this.translate.instant('PROFILE.Title10'),
      message: this.translate.instant('PROFILE.Message1') + ' ' + this.email_variable,
      buttons: [{
        text: this.translate.instant('PROFILE.Button3'),
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          //console.log('Confirm Cancel: blah');
        }
      }, {
        text: this.translate.instant('PROFILE.Button2'),
        handler: () => {
          location.href = "mailto:" + this.email_variable;
        }
      }]
    });

    await alert.present();
  }
  temas: any = {}
  async cargarTemas() {
    let temas = {}
    let temasSnap = await this.db.collection("motivos_consulta").get().toPromise()
    let docs = temasSnap.docs;
    for (const i in docs) {
      const doc = docs[i];
      let motivosSnap = await this.db.collection("motivos_consulta/" + doc.id + "/temas").get().toPromise();
      let docM = motivosSnap.docs;
      for (const ii in docM) {
        const d = docM[ii];
        temas[d.id] = {
          texto: d.data().titulo[1],
          titulo: doc.data().titulo[1]
        }
      }
    }
    this.temas = temas
    this.change.detectChanges();
  }

  getConversacion(id: string) {
    this.cargarTemas()
    this.generalService.getDocPromise1('conversaciones', id).then((res: any) => {
      this.conversacion = res;
      //console.log(res)
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

  removeBR(html: string) {
    return html.replace("<br>", "")
  }

  modal: HTMLIonModalElement
  async presentModalRateApp() {
    this.modal = await this.modalController.create({
      component: ModalRateTherapistPage,
      cssClass: 'with-top',
      componentProps: {
        usuario: this.uid,
        terapeuta: this.user_data ? this.user_data.terapeuta || "" : ""
      }
    });

    await this.modal.present();

  }

  async presentPopoverChangeSusbcription(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverChangeSubscriptionPage,
      event: ev,
      translucent: false
    });

    await popover.present();
  }

}