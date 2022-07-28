import {
  Component
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  AuthService
} from './../../services/auth.service';
import {
  GeneralService
} from './../../services/general.service';
import {
  NavController,
  LoadingController,
  ModalController
} from '@ionic/angular';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  LiveChatModalPage
} from './../../components/live-chat-modal/live-chat-modal.page';

@Component({
  selector: 'app-accept-terms',
  templateUrl: './accept-terms.page.html',
  styleUrls: ['./accept-terms.page.scss'],
})
export class AcceptTermsPage {

  id: string;
  id1: string;
  regalo: string;
  uid: string;
  there_is: boolean = false;
  token: string;
  subscription: any;
  token_t: string;
  user_db: any;
  pago_pendiente: any;

  constructor(private modalController: ModalController, private auth: AngularFireAuth, private route: ActivatedRoute, private authService: AuthService, private generalService: GeneralService, private navController: NavController, private http: HttpClient, private loadingController: LoadingController, private translate: TranslateService) {
    this.id = this.route.snapshot.params.id;
    this.id1 = this.route.snapshot.params.id1;
    this.regalo = this.route.snapshot.params.regalo;
  }

  ionViewDidEnter() {
    this.getCurrentUser();
    this.getSubscription(this.id);
  }

  getCurrentUser() {
    this.authService.getCurrentUserPromise().then((res: any) => {
      this.uid = res.uid;
      this.getCard(this.uid);
      this.getPagoPendiente(this.uid);
      this.getCurrentUserDB(this.uid);
    }).catch((err: any) => console.log(err));
  }

  getPagoPendiente(id: string) {
    this.generalService.getDocPromise1('pagos_pendientes', id).then((res: any) => {
      this.pago_pendiente = res;
    }).catch((err: any) => console.log(err));
  }

  getCurrentUserDB(id: string) {
    this.authService.getUserPromiseDB(id).then((res: any) => {
      this.user_db = res;
    }).catch((err: any) => console.log(err));
  }

  updateUser() {
    this.user_db.free_trial = false;
    this.authService.updateUser(this.uid, this.user_db);
  }

  getCard(id: string) {
    this.generalService.getDocPromise1('tarjetas', id).then(res => {
      if (res == false) {
        this.there_is = false;
      } else {
        this.there_is = true;
        this.token_t = res.token;
      }
    }).catch((err: any) => console.log(err));
  }

  getSubscription(id: string) {
    this.generalService.getDocPromise1('planes', id).then((res: any) => {
      this.subscription = res;
      console.log(this.subscription);
    }).catch((err: any) => console.log(err));
  }

  regresar() {
    this.navController.navigateRoot('/select-subscription/' + this.id1);
  }

  async pay() {
    if (this.there_is) {
      if (this.subscription.permite_live_session) {
        const modal = await this.modalController.create({
          component: LiveChatModalPage,
          componentProps: {
            tiempoMin: this.subscription.live_minutes,
            therapists: this.id1,
            uid: this.uid
          },
          swipeToClose: true,
          cssClass: 'with-top1'
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
    } else {
      if (this.regalo == 'false') {
        this.navController.navigateRoot('/add-payment/' + this.id + '/' + this.id1 + '/' + this.regalo);
      } else {
        if (this.subscription.permite_live_session) {
          const modal = await this.modalController.create({
            component: LiveChatModalPage,
            componentProps: {
              tiempoMin: this.subscription.live_minutes,
              therapists: this.id1,
              uid: this.uid
            },
            swipeToClose: true,
            cssClass: 'with-top1'
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
    }
  }

  async pay1() {
    let l = await this.presentLoading();
    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });
    if (this.pago_pendiente) {
      let objPa1 = {
        token: this.token_t,
        currency: "GTQ",
        amount: this.pago_pendiente.monto,
        uid: this.uid,
        idPaquete: this.pago_pendiente.paquete,
        regalo: false,
        emergencia: true,
        terapueta: this.id1
      }
      this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/pay_card', objPa1, {
        headers: headers
      }).toPromise().then((res: any) => {
        if (res.responseCode == 100 || res.responseCode == 0 || res.responseCode == 0o0) {
          this.generalService.deleteDoc('pagos_pendientes', this.uid);
          let bo = 1;
          if (this.regalo == 'false') {
            bo = 0;
          } else {
            this.updateUser();
          }
          let objPa = {
            token: this.token_t,
            currency: "GTQ",
            amount: this.subscription.precio.toString(),
            uid: this.uid,
            idPaquete: this.id,
            regalo: bo,
            emergencia: false,
            terapueta: this.id1
          }
          console.log(objPa);
          if (bo == 1) {
            l.dismiss();
            this.navController.navigateRoot('/payment-notification/success/' + this.id + '/' + this.id1);
          } else {
            this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/pay_card', objPa, {
              headers: headers
            }).toPromise().then((res: any) => {
              if (res.responseCode == 100 || res.responseCode == 0 || res.responseCode == 0o0) {
                l.dismiss();
                this.navController.navigateRoot('/payment-notification/success/' + this.id + '/' + this.id1);
              } else {
                l.dismiss();
                console.log(res)
                this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
              }
            }).catch(err => {
              console.log("termino mal", err)
              l.dismiss();
              this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
            });
          }
        } else {
          l.dismiss();
          console.log(res)
          this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
        }
      }).catch(err => {
        console.log(err);
        l.dismiss();
        this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
      })
    } else {
      let bo = 1;
      if (this.regalo == 'false') {
        bo = 0;
      } else {
        this.updateUser();
      }
      let objPa = {
        token: this.token_t,
        currency: "GTQ",
        amount: this.subscription.precio.toString(),
        uid: this.uid,
        idPaquete: this.id,
        regalo: bo,
        emergencia: false,
        terapueta: this.id1
      }
      console.log(objPa);
      if (bo == 1) {
        l.dismiss();
        this.navController.navigateRoot('/payment-notification/success/' + this.id + '/' + this.id1);
      } else {
        this.http.post('https://us-central1-mimento-app.cloudfunctions.net/apicobros/pay_card', objPa, {
          headers: headers
        }).toPromise().then((res: any) => {
          if (res.responseCode == 100 || res.responseCode == 0 || res.responseCode == 0o0) {
            l.dismiss();
            this.navController.navigateRoot('/payment-notification/success/' + this.id + '/' + this.id1);
          } else {
            l.dismiss();
            console.log(res)
            this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
          }
        }).catch(err => {
          l.dismiss();
          this.navController.navigateRoot('/payment-notification/denied/' + this.id + '/' + this.id1);
        });
      }
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('LOADING.msg')
    });
    await loading.present();
    return loading;
  }

}