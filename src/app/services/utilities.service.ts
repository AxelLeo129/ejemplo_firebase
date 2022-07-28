import { Injectable, isDevMode } from '@angular/core';
import { AlertController, ToastController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';
import { AngularFirestore } from '@angular/fire/firestore';
;
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  API_ENDPOINT: string;
  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public http: HttpClient,
    public auth: AngularFireAuth,
    private platform: Platform,
    private translate: TranslateService,
    private db: AngularFirestore
  ) {
    this.API_ENDPOINT = isDevMode() && !this.platform.is("hybrid") ? "http://localhost:5005/el-siglo/us-central1/api/" : "https://us-central1-el-siglo.cloudfunctions.net/api/"
  }

  errorAuth(e: any) {
    let errorCode = e.code, mensaje = "Algo ha salido mal";
    switch (errorCode) {
      case "auth/claims-too-large":
        mensaje = this.translate.instant("ErrorAuth.claims-too-large")
        break;
      case "auth/invalid-argument":
        mensaje = this.translate.instant("ErrorAuth.invalid-argument")
        break;
      case "auth/invalid-display-name":
        mensaje = this.translate.instant("ErrorAuth.invalid-display-name")
        break;
      case "auth/invalid-email-verified":
        mensaje = this.translate.instant("ErrorAuth.invalid-email-verified")
        break;
      case "auth/invalid-email":
        mensaje = this.translate.instant("ErrorAuth.invalid-email")
        break;
      case "auth/invalid-password":
        mensaje = this.translate.instant("ErrorAuth.invalid-password")
        break;
      case "auth/invalid-photo-url":
        mensaje = this.translate.instant("ErrorAuth.invalid-photo-url")
        break;
      case "auth/missing-uid":
        mensaje = this.translate.instant("ErrorAuth.missing-uid")
        break;
      case "auth/invalid-uid":
        mensaje = this.translate.instant("ErrorAuth.invalid-uid")
        break;
      case "auth/uid-alread-exists":
        mensaje = this.translate.instant("ErrorAuth.uid-alread-exists")
        break;
      case "auth/email-already-exists":
        mensaje = this.translate.instant("ErrorAuth.email-already-exists")
        break;
      case "auth/user-not-found":
        mensaje = this.translate.instant("ErrorAuth.user-not-found")
        break;
      case "auth/internal-error":
        mensaje = this.translate.instant("ErrorAuth.internal-error")
        break;
      case "auth/wrong-password":
        mensaje = this.translate.instant("ErrorAuth.wrong-password")
        break;
      case "auth/uid-already-exists":
        mensaje = this.translate.instant("ErrorAuth.uid-already-exists")
        break;
    }
    console.log(e)
    this.presentAlert(this.translate.instant("ALERTS.Error_title"), `${mensaje} (${errorCode})`)
  }

  presentAlert(header: string, message: string, boton?: string): Promise<boolean> {
    return new Promise((res, rej) => {
      this.alertController.create({
        header,
        message, backdropDismiss: false,
        buttons: [{
          text: boton || "Aceptar",
          handler: () => {
            res(true)
          }
        }]
      }).then(alert => {
        alert.present()
      })
    });
  }

  presentAlertConfirm(header: string, message: string): Promise<boolean> {
    return new Promise((res, rej) => {
      this.alertController.create({
        header: header,
        message: message, backdropDismiss: false,
        buttons: [{
          text: this.translate.instant('UTILITIESSERVICE.Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { res(false) }
        }, {
          text: this.translate.instant('UTILITIESSERVICE.Ok'),
          handler: () => { res(true) }
        }]
      }).then(a => a.present())
    });
  }
  async presentToast(duration?: number, text?: string): Promise<HTMLIonToastElement> {
    return new Promise(async (res, rej) => {
      const toast = await this.toastController.create({
        message: text || "Por favor, espere",
        duration: duration || 2000
      });
      toast.present();
      res(toast)
    });
  }
  public createLoading(text?: string, duration?: number,): Promise<HTMLIonLoadingElement> {
    return new Promise((res, rej) => {
      this.loadingController.create({
        message: text || 'Por favor, espere',
        backdropDismiss: false,
        duration: duration || 0
      }).then((l: HTMLIonLoadingElement) => {
        l.present();
        res(l);
      })
    })
  }

  public dissmissLoading(): Promise<HTMLIonLoadingElement> {
    return new Promise((res, rej) => {
      this.loadingController.dismiss();
    });
  }

  public httpRequest(method: string, getType: boolean, silence: boolean, afterTitle?: string, afterMessage?: string, jsonData?: any, headers?: boolean, responseType?: string): Promise<any> {
    return new Promise(async (res, rej) => {
      let loading: HTMLIonLoadingElement = await this.createLoading()
      try {
        let token: string;
        if (headers) token = await (await this.auth.currentUser).getIdToken(true)
        let options: any = getType ? {} : { responseType: responseType || 'text' }
        if (headers) options.headers = new HttpHeaders().set("authorization", token)
        let requestT = getType ?
          this.http.get(this.API_ENDPOINT + method, options) :
          this.http.post(this.API_ENDPOINT + method, jsonData, options);
        let s: any = await requestT.toPromise()
        await loading.dismiss();
        if (s && s.error && s.error !== 0) // NO HAY ERROR
          rej(s.error)
        else
          res(s)
      } catch (e) {
        await loading.dismiss();
        let em = e && e.error && e.error.code ? e.error.code : "error D"
        await this.presentAlert(this.translate.instant("ALERTS.Error_title"), this.translate.instant("ALERTS.Error_peticion"),)
        rej(e)
      }
    })
  }

  formatDate(ts: number, tipo?: number): string {
    var today = new Date(ts);
    var dd: any = today.getDate();
    var mm: any = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hh: any = today.getHours();
    var MM = today.getMinutes();

    if (dd < 10) { dd = '0' + dd }
    if (hh < 10) { hh = '0' + hh }
    if (mm < 10) { mm = '0' + mm }
    switch (tipo) {
      case 1:
        return yyyy + "-" + mm + "-" + dd;
      case 2:
        return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + MM;
      default:
        return dd + '/' + mm + '/' + yyyy;
    }
  }
  getAge(birthDate: number): number {
    var today = new Date();
    var birthDateO = new Date(birthDate);
    var age = today.getFullYear() - birthDateO.getFullYear();
    var m = today.getMonth() - birthDateO.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateO.getDate())) {
      age--;
    }
    return age;
  }
  formatPrice(numero: number): string {
    return (Math.round(numero * 100) / 100).toFixed(2);
  }


  async presentAlertPrompt(titulo?: string, mensaje?: string, tipo?: 'text' | 'number' | 'checkbox' | 'radio' | 'textarea', placeholder?: string) {
    return new Promise(async (res, rej) => {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: titulo,
        message: mensaje,
        inputs: [
          {
            name: 'input',
            type: tipo || 'text',
            placeholder
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              rej(false)
            }
          }, {
            text: 'Aceptar',
            handler: (r: any) => {
              console.log(r)
              res(r.input)
            }
          }
        ]
      });
      await alert.present();
    });
  }
  quejaEtica(terapeutaID?: string) {
    return new Promise(async (res, rej) => {
      try {
        let mensaje = await this.presentAlertPrompt(
          this.translate.instant('QUEJAS.Title'),
          this.translate.instant('QUEJAS.Message'),
          "text",
          this.translate.instant('QUEJAS.Input'));
        console.log(mensaje)
        if (!mensaje) {
          this.presentAlert(this.translate.instant("QUEJAS.ErrorTitle"), this.translate.instant("QUEJAS.ErrorMessage"))
        } else {
          let uid = (await this.auth.currentUser).uid,
            userSnap = await this.db.collection("usuarios").doc(uid).get().toPromise(),
            userData = userSnap.data();
          let fecha = new Date()
          await this.db.collection("quejas_eticas").add({
            usuario: uid,
            terapeuta: terapeutaID || userData.terapeuta,
            fecha: fecha.getTime(),
            mensaje
          })
          res(true)
        }
      } catch (error) {
        rej(error)
      }
    });
  }
}
