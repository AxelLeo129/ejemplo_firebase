import {
  Component,
  OnInit,
  ViewChild,
  Input
} from '@angular/core';
import {
  Subscription
} from 'rxjs';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  IonSlides,
  LoadingController,
  AlertController,
  ModalController,
  ToastController,
  NavController
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
  GeneralService
} from './../../services/general.service';

@Component({
  selector: 'app-change-payment-modal',
  templateUrl: './change-payment-modal.page.html',
  styleUrls: ['./change-payment-modal.page.scss'],
})
export class ChangePaymentModalPage implements OnInit {

  @Input() token_card;
  @Input() id1;
  @Input() monto;
  @Input() idPaquete;

  user_subscription: Subscription;
  uid: string;
  email: string;
  token: string;

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
      typeCard: "001"
    }
  }

  @ViewChild('slides', {
    static: true
  }) slides: IonSlides;

  subscription_subcription: Subscription;
  subscription: any;
  paises: any[];
  pais: string;

  constructor(private generalService: GeneralService,

    private navController: NavController, private toastController: ToastController, private modalController: ModalController, private loadingController: LoadingController, private alertController: AlertController, private translate: TranslateService, private authService: AuthService, private http: HttpClient, private auth: AngularFireAuth) {
    this.paymentForm = this.createFormGroup();

    this.min_date = new Date();
    this.max_date = new Date();
  }

  ngOnInit() {
    //this.getToken();
    this.slides.lockSwipes(true);
    this.min_date = this.getDates1();
    this.max_date = this.getDates();
    this.getCurrentUser();

    this.http.get("https://firebasestorage.googleapis.com/v0/b/servido-3c4e6.appspot.com/o/paises.json?alt=media&token=e5176005-edeb-4f35-891b-7945b2db8b1d").subscribe((s: any[]) => {
      this.paises = s;
      this.http.get("https://ipapi.co/json/").subscribe((ss: any) => {
        let index = this.paises.map(function (e) { return e["alpha-2"]; }).indexOf(ss.country)
        this.pais = s[index].name;
        this.userForm = this.createFormGroup1(this.pais);
      })
    })
  }

  ngOnDestroy() {
    this.user_subscription.unsubscribe();
  }

  getCurrentUser() {
    let auth = this.authService.getCurrentUser();
    this.user_subscription = auth.subscribe((res: any) => {
      this.uid = res.uid;
      this.getCurrentUserDB(this.uid);
    });
  }

  getCurrentUserDB(id: string) {
    let user_observable = this.authService.getCurrentUserDB(id);
    user_observable.subscribe((res: any) => {
      this.email = res.correo;
    });
  }

  createFormGroup() {
    return new FormGroup({
      'card_number': new FormControl('', [Validators.required]),
      'cc_cvv2': new FormControl('', [Validators.required]),
      'owner_name': new FormControl('', Validators.required),
      'date': new FormControl('', Validators.required)
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
      'zip': new FormControl('', Validators.required),

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
    if (this.paymentForm.value.card_number.toString().length != 16) {
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
      tipo1 = tipo1.toString();
      tipo1 = tipo1.slice(0, 2);
      //console.log(tipo1);
      if (tipo1 == "51" || tipo1 == "52" || tipo1 == "53" || tipo1 == "54" || tipo1 == "55") {
        type = "002";
      } else {
        return this.presentAlertConfirm();
      }
    }
    this.objP.card.cardNumber = this.paymentForm.value.card_number;
    this.objP.card.CVV2 = this.paymentForm.value.cc_cvv2;
    this.objP.card.expMonth = split_array[1];
    this.objP.card.expYear = split_array[0].substr(-2);
    this.objP.card.typeCard = type;
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
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
    }
  }

  async setToken() {
    this.presentLoading();
    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });
    if (this.token_card) {
      let objD: any = {
        token: this.token_card,
        uid: this.uid
      }
      console.log(this.objP);
      this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/delete_card', objD, {
        headers: headers
      }).toPromise().then((res: any) => {
        //console.log(res);
        this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/token_card', this.objP, {
          headers: headers
        }).toPromise().then((res: any) => {
          this.loadingController.dismiss();
          //console.log(res);
          if (res.error) {
            console.log(res);
            this.modalController.dismiss();
            this.presentToast('PROFILE.DeniedMessage');
          } else {
            //console.log(res);
            this.presentToast('PROFILE.SucessMessage');
            this.modalController.dismiss();
          }
        }).catch(err => {
          this.loadingController.dismiss();
          console.log(err);
          this.modalController.dismiss();
          this.presentToast('PROFILE.DeniedMessage');
        });
      }).catch(err => {
        console.log(err);
        this.loadingController.dismiss();
        this.modalController.dismiss();
        this.presentToast('PROFILE.DeniedMessage');
      });
    } else {
      localStorage.setItem('emergency', JSON.stringify('true'));
      this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/token_card', this.objP, {
        headers: headers
      }).toPromise().then((res: any) => {
        let objPa = {
          //token: res.token.QpayToken,
          token: '5918522417436719504010',
          currency: "GTQ",
          amount: this.monto,
          uid: this.uid,
          idPaquete: this.idPaquete,
          regalo: false,
          emergencia: true
        }
        console.log(objPa);
        if (res.error) {
          this.loadingController.dismiss();
          console.log(res)
          let fecha = new Date();
          let objPP = {
            monto: this.monto,
            fecha,
            user: this.uid,
            terapeuta: this.id1,
            plan: this.idPaquete
          }
          this.generalService.saveDocWithoutAlert('pagos_pendientes', objPP, this.uid).then(() => {
            this.navController.navigateRoot('/payment-notification/denied/' + this.idPaquete + '/' + this.id1);
          }).catch((err) => {
            console.log(err);
            this.navController.navigateRoot('/payment-notification/denied/' + this.idPaquete + '/' + this.id1);
          });
          this.modalController.dismiss();
        } else {
          this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/pay_card', objPa, {
            headers: headers
          }).toPromise().then((res: any) => {
            this.loadingController.dismiss();
            console.log(res);
            this.navController.navigateRoot('/payment-notification/success/' + this.idPaquete + '/' + this.id1);
          }).catch(err => {
            this.loadingController.dismiss();
            console.log(err);
            let fecha = new Date();
            let objPP = {
              monto: this.monto,
              fecha,
              user: this.uid,
              terapeuta: this.id1,
              plan: this.idPaquete
            }
            this.generalService.saveDocWithoutAlert('pagos_pendientes', objPP, this.uid).then(() => {
              this.navController.navigateRoot('/payment-notification/denied/' + this.idPaquete + '/' + this.id1);
            }).catch((err) => {
              console.log(err);
              this.navController.navigateRoot('/payment-notification/denied/' + this.idPaquete + '/' + this.id1);
            });
          });
        }
      }).catch(err => {
        this.loadingController.dismiss();
        console.log(err);
        let fecha = new Date();
        let objPP = {
          monto: this.monto,
          fecha,
          user: this.uid,
          terapeuta: this.id1,
          plan: this.idPaquete
        }
        this.generalService.saveDocWithoutAlert('pagos_pendientes', objPP, this.uid).then(() => {
          this.navController.navigateRoot('/payment-notification/denied/' + this.idPaquete + '/' + this.id1);
        }).catch((err) => {
          console.log(err);
          this.navController.navigateRoot('/payment-notification/denied/' + this.idPaquete + '/' + this.id1);
        });
      })
    }

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
  }

  regresar() {
    this.modalController.dismiss();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: this.translate.instant(message),
      duration: 2000
    });
    toast.present();
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