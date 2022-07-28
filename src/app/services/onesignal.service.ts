import { Injectable } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OneSignal, OSNotificationOpenedResult, OSNotification } from '@ionic-native/onesignal/ngx';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class OnesignalService {

  constructor(private platform: Platform,
    public alertController: AlertController,
    private router: Router,
    private auth: AngularFireAuth,
    public oneSignal: OneSignal) { }

  private initialized: boolean;
  init() {
    this.oneSignal.startInit('313adad1-4f20-49b2-a20e-e9dc335634ba', '779251314240');
    var iosSettings = {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false
    };
    this.oneSignal.iOSSettings(iosSettings);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification)
    this.oneSignal.handleNotificationReceived().subscribe((data) => {
      if (data.payload && data.payload.additionalData && data.payload.additionalData.url)
        this.presentAlert(data)
    });

    this.oneSignal.handleNotificationOpened().subscribe((data: OSNotificationOpenedResult) => {
      console.log('NOTIFICACION OPENED', data);

      if (data.notification.payload && data.notification.payload.additionalData && data.notification.payload.additionalData.url) {
        this.auth.onAuthStateChanged(s => {
          if (s) {
            this.router.navigate([data.notification.payload.additionalData.url, data.notification.payload.additionalData.parametros || {}])
          }
        }).then((uns: any) => { });
      }
    });

    this.oneSignal.endInit();
    this.auth.onAuthStateChanged(s => {
      if (s) {
        this.oneSignal.setExternalUserId(s.uid)
      } else {
        try {
          this.oneSignal.removeExternalUserId()
        } catch (error) {

        }
      }
    }).then((uns: any) => { });
  }

  async presentAlert(data: OSNotification) {
    const alert = await this.alertController.create({
      header: data.payload.title,
      message: data.payload.body,
      backdropDismiss: false,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => { }
      }, {
        text: 'Ver',
        handler: () => {
          console.log("Route", data.payload.additionalData)
          this.auth.onAuthStateChanged(s => {
            this.router.navigate([data.payload.additionalData.url, data.payload.additionalData.parametros || {}])
          }).then((uns: any) => { });

        }
      }]
    });

    await alert.present();
  }
  getToken() {
    return this.oneSignal.getIds();
  }
  clearToken() {
    return this.oneSignal.removeExternalUserId()
  }

}
