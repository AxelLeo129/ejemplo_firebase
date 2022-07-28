import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  AlertController,
  IonSlides,
  NavController,
  LoadingController,
  ModalController
} from '@ionic/angular';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  AuthService
} from './../../services/auth.service';
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
  GeneralService
} from './../../services/general.service';
import {
  LiveChatModalPage
} from './../../components/live-chat-modal/live-chat-modal.page';

import {
  VibracionService
} from '../../services/vibracion.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.page.html',
  styleUrls: ['./add-payment.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AddPaymentPage {

  uid: string;
  email: string;
  paymentForm: FormGroup;
  userForm: FormGroup;
  prueba: string;

  min_date: any;
  max_date: any;
  objP: any = {
    user: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "Guatemala",
      email: "",
      uid: ""
    },
    card: {
      cardNumber: "4111111111111111",
      expMonth: "10",
      expYear: "20",
      typeCard: "001",
      CVV2: ''
    },
    bill: {
      nombre_facturacion: "",
      nit: "",
      direccion_facturacion: ""
    }
  }

  @ViewChild('slides', {
    static: true
  }) slides: IonSlides;

  id: string;
  id1: string;
  subscription: any;
  regalo: string;
  user_data: any;
  pago_pendiente: any;

  paises: any[];
  pais: string;

  constructor(
    private modalController: ModalController,
    private vibracionService: VibracionService,
    private generalService: GeneralService, private loadingController: LoadingController, private alertController: AlertController, private translate: TranslateService, private authService: AuthService, private http: HttpClient, private auth: AngularFireAuth, private navController: NavController, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
    this.id1 = this.route.snapshot.params.id1;
    this.regalo = this.route.snapshot.params.regalo;
    this.paymentForm = this.createFormGroup();

    this.min_date = new Date();
    this.max_date = new Date();
  }

  ionViewDidEnter() {
    //this.getToken();
    this.slides.lockSwipes(true);
    this.min_date = this.getDates1();
    this.max_date = this.getDates();
    this.getCurrentUser();
    this.getSubscription(this.id);

    this.http.get("https://firebasestorage.googleapis.com/v0/b/servido-3c4e6.appspot.com/o/paises.json?alt=media&token=e5176005-edeb-4f35-891b-7945b2db8b1d").subscribe((s: any[]) => {
      this.paises = s;
      this.http.get("https://ipapi.co/json/").subscribe((ss: any) => {
        let index = this.paises.map(function (e) {
          return e["alpha-2"];
        }).indexOf(ss.country)
        this.pais = s[index].name;
        this.userForm = this.createFormGroup1(this.pais);
      })
    })
  }

  getSubscription(id: string) {
    this.generalService.getDocPromise1('planes', id).then((res: any) => {
      this.subscription = res;
    }).catch((err: any) => console.log(err));
  }

  getCurrentUser() {
    this.authService.getCurrentUserPromise().then((res: any) => {
      this.uid = res.uid;
      this.getCurrentUserDB(this.uid);
      this.getPagoPendiente(this.uid);
    }).catch((err: any) => console.log(err));
  }

  getPagoPendiente(id: string) {
    this.generalService.getDocPromise1('pagos_pendientes', id).then((res: any) => {
      this.pago_pendiente = res;
    }).catch((err: any) => console.log(err));
  }

  getCurrentUserDB(id: string) {
    this.authService.getUserPromiseDB(id).then((res: any) => {
      this.user_data = res;
      this.email = res.correo;
    });
  }

  createFormGroup() {
    return new FormGroup({
      'card_number': new FormControl('', [Validators.required]),
      'cc_cvv2': new FormControl('', [Validators.required]),
      'owner_name': new FormControl('', Validators.required),
      'date': new FormControl('', Validators.required),
      'bill_name': new FormControl('', Validators.required),
      'nit': new FormControl('', Validators.required),
      'bill_address': new FormControl('', Validators.required)
    });
  }

  createFormGroup1(pais: string) {
    return new FormGroup({
      'fist_name': new FormControl('', Validators.required),
      'last_name': new FormControl('', Validators.required),
      'address': new FormControl('', Validators.required),
      'city': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'country': new FormControl(pais || "Guatemala", Validators.required),
      'zip': new FormControl('', Validators.required)
    });
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

  setCard() {
    //console.log(this.paymentForm.value.card_number)
    if (this.paymentForm.value.card_number.length < 16) {
      //console.log("BAD NUMBER CARD")
      return this.presentAlertConfirm();
    }
    let split_array = this.paymentForm.value.date.split('-', 3);
    let tipo = this.paymentForm.value.card_number;
    let type = '';
    tipo = tipo.toString();
    tipo = tipo.slice(0, 1);
    if (tipo == "4") {
      type = "001";
    } else {
      var tipo1 = this.paymentForm.value.card_number;
      tipo1 = tipo1.slice(0, 2);
      //console.log(tipo1);
      if (tipo1 == "51" || tipo1 == "52" || tipo1 == "53" || tipo1 == "54" || tipo1 == "55") {
        type = "002";
      } else {
        //console.log("BAD NUMBER TYPE")
        return this.presentAlertConfirm();
      }
    }
    this.objP.card.cardNumber = this.paymentForm.value.card_number;
    this.objP.card.CVV2 = this.paymentForm.value.cc_cvv2;
    this.objP.card.expMonth = split_array[1];
    this.objP.card.expYear = split_array[0].substr(-2);
    this.objP.card.typeCard = type;
    this.objP.bill.nombre_facturacion = this.paymentForm.value.bill_name;
    this.objP.bill.nit = this.paymentForm.value.nit;
    this.objP.bill.direccion_facturacion = this.paymentForm.value.bill_address;
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
    //console.log(this.objP);
  }

  backSlide() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  setUserInfo() {
    if (this.userForm.value.fist_name == '' || this.userForm.value.last_name == '' || this.userForm.value.address == '' || this.userForm.value.state == '' || this.userForm.value.zip == '' || this.userForm.value.city == '') {
      return this.presentAlert();
    } else {
      this.objP.user.firstName = this.userForm.value.fist_name;
      this.objP.user.lastName = this.userForm.value.last_name;
      this.objP.user.address = this.userForm.value.address;
      this.objP.user.city = this.userForm.value.city;
      this.objP.user.state = this.userForm.value.state;
      this.objP.user.zip = this.userForm.value.zip.toString();
      this.objP.user.country = this.userForm.value.country || "Guatemala";
      this.objP.user.email = this.email;
      this.objP.user.uid = this.uid;
      this.setToken();
      //this.navController.navigateRoot('/payment-notification/success');
    }
  }

  async getToken() {
    let token = await (await this.auth.currentUser).getIdToken(false);
    console.log(token)
  }

  async setToken() {
    if (this.subscription.permite_live_session) {
      const modal = await this.modalController.create({
        component: LiveChatModalPage,
        componentProps: {
          tiempoMin: this.subscription.live_minutes,
          therapists: this.id1,
          uid: this.uid
        },
        swipeToClose: true,
        cssClass: 'with-top'
      });

      await modal.present();

      const {
        data
      }: any = await modal.onDidDismiss();

      if (data) {
        this.pay1();
      }

    } else {
      this.pay1();
    }
  }

  async pay1() {
    console.log(this.user_data);
    this.presentLoading();
    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });
    //console.log(this.objP);
    this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/token_card', this.objP, {
      headers: headers
    }).toPromise().then((res: any) => {
      if (res.error) {
        this.loadingController.dismiss();
        this.vibracionService.vibrarIncorrecto()
        console.log(res)
        this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
      } else {
        console.log(res);
        this.user_data.nombre_facturacion = this.paymentForm.value.bill_name;
        this.user_data.nit = this.paymentForm.value.nit;
        this.user_data.direccion_facturacion = this.paymentForm.value.bill_address;
        console.log(this.user_data);
        this.authService.updateUser(this.uid, this.user_data).then(() => {
          console.log('update')
          console.log(this.user_data);
          if (this.pago_pendiente) {
            let objPa1 = {
              token: res.token.QpayToken,
              currency: "GTQ",
              amount: this.pago_pendiente.monto,
              uid: this.uid,
              idPaquete: this.pago_pendiente.terapeuta,
              regalo: false,
              emergencia: true,
              terapueta: this.id1
            }
            console.log(objPa1);
            this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/pay_card', objPa1, {
              headers: headers
            }).toPromise().then((res: any) => {
              if (res.responseCode == 100 || res.responseCode == 0 || res.responseCode == 0o0) {
                this.generalService.deleteDoc('pagos_pendientes', this.uid);
                this.vibracionService.vibrarCorrecto();
                console.log(res);
                let bo = 0;
                if (this.regalo == 'true') {
                  bo = 1;
                } 
                let objPa = {
                  token: res.token.QpayToken,
                  currency: "GTQ",
                  amount: this.subscription.precio.toString(),
                  uid: this.uid,
                  idPaquete: this.id,
                  regalo: bo,
                  emergencia: false,
                  terapueta: this.id1
                }
                console.log(objPa);

                this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/pay_card', objPa, {
                  headers: headers
                }).toPromise().then((res: any) => {
                  console.log(res);
                  if (res.responseCode == 100 || res.responseCode == 0 || res.responseCode == 0o0) {
                    this.loadingController.dismiss();
                    this.vibracionService.vibrarCorrecto();
                    console.log(res);
                    this.navController.navigateRoot('/payment-notification/success/' + this.id + '/' + this.id1);
                  } else {
                    this.loadingController.dismiss();
                    this.vibracionService.vibrarIncorrecto()
                    console.log(res)
                    this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
                  }
                }).catch(err => {
                  this.loadingController.dismiss();
                  this.vibracionService.vibrarIncorrecto()
                  console.log(err);
                  this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
                });
              } else {
                this.loadingController.dismiss();
                this.vibracionService.vibrarIncorrecto()
                console.log(res)
                this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
              } 
            }).catch(err => {
              this.loadingController.dismiss();
              this.vibracionService.vibrarIncorrecto()
              console.log(err);
              this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
            });
          } else {
            let bo = 0;
            if (this.regalo == 'true') {
              bo = 1;
            }
            let objPa = {
              token: res.token.QpayToken,
              currency: "GTQ",
              amount: this.subscription.precio.toString(),
              uid: this.uid,
              idPaquete: this.id,
              regalo: bo,
              emergencia: false,
              terapueta: this.id1
            }
            console.log(objPa);
            this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/pay_card', objPa, {
              headers: headers
            }).toPromise().then((res: any) => {
              console.log(res, res.responseCode);
              if (res.responseCode == 100 || res.responseCode == 0 || res.responseCode == 0o0) {
                this.loadingController.dismiss();
                this.vibracionService.vibrarCorrecto();
                console.log(res);
                this.navController.navigateRoot('/payment-notification/success/' + this.id + '/' + this.id1);
              } else {
                this.loadingController.dismiss();
                this.vibracionService.vibrarIncorrecto()
                console.log(res)
                this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
              }
            }).catch(err => {
              this.loadingController.dismiss();
              this.vibracionService.vibrarIncorrecto()
              console.log(err);
              this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
            });
          }
        }).catch((err: any) => {
          console.log(err);
        })
      }
    }).catch(err => {
      this.loadingController.dismiss();
      this.vibracionService.vibrarIncorrecto();
      console.log(err);
      this.presentAlertConfirmRoute();
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.translate.instant('ALERTCARD.header'),
      message: this.translate.instant('ALERTCARD.msg'),
      buttons: [{
        text: this.translate.instant('ALERTCARD.Button1'),
        handler: () => {
          this.onResertForm();
        }
      }]
    });

    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('ALERTCARD.header'),
      message: this.translate.instant('ALERTCARD.msg1'),
      buttons: [this.translate.instant('ALERTCARD.Button1')]
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('LOADING.msg'),
    });
    await loading.present();
  }

  onResertForm() {
    this.paymentForm.reset();
    this.userForm.reset();
  }

  regresar() {
    this.slides.getActiveIndex().then(s => {
      console.log(s)
      if (s === 1) {
        this.slides.lockSwipes(false);
        this.slides.slideTo(0, 300)
        this.slides.lockSwipes(true);
      } else {
        this.navController.back();
      }
    })
  }

  async presentAlertConfirmRoute() {
    const alert = await this.alertController.create({
      header: this.translate.instant('ADDPAYMENT.Alert_title'),
      subHeader: this.translate.instant('ADDPAYMENT.Alert_msg'),
      message: this.translate.instant('ADDPAYMENT.Alert_msg1'),
      buttons: [{
        text: this.translate.instant('ADDPAYMENT.Cancel'),
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          this.navController.navigateRoot('/need-help')
        }
      }, {
        text: this.translate.instant('ADDPAYMENT.Ok'),
        handler: () => {
          this.onResertForm();
          this.slides.lockSwipes(false);
          this.slides.slideTo(0);
          this.slides.lockSwipes(true);
        }
      }]
    });

    await alert.present();
  }

  get card_number() {
    return this.paymentForm.get('card_number');
  }
  get cc_cvv2() {
    return this.paymentForm.get('cc_cvv2');
  }
  get owner_name() {
    return this.paymentForm.get('owner_name');
  }
  get date() {
    return this.paymentForm.get('date');
  }
  get bill_name() {
    return this.paymentForm.get('bill_name');
  }
  get nit() {
    return this.paymentForm.get('nit');
  }
  get bill_address() {
    return this.paymentForm.get('bill_address');
  }

  get fist_name() {
    return this.userForm.get('fist_name');
  }
  get last_name() {
    return this.userForm.get('last_name');
  }
  get address() {
    return this.userForm.get('address');
  }
  get state() {
    return this.userForm.get('state');
  }

  get zip() {
    return this.userForm.get('zip');
  }

  get city() {
    return this.userForm.get('city');
  }


}