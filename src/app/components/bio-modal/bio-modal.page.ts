import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  FingerprintAIO
} from '@ionic-native/fingerprint-aio/ngx';
import {
  ModalController
} from '@ionic/angular';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-bio-modal',
  templateUrl: './bio-modal.page.html',
  styleUrls: ['./bio-modal.page.scss'],
})
export class BioModalPage {

  fist_time: boolean = false;
  img_bool: boolean = false;
  options: any = {
    clientId: 'Mimento Auth Vault', //Android: Used for encryption. iOS: used for dialogue if no `localizedReason` is given.
    clientSecret: 'dfs-3424-DFSFD', //Necessary for Android encrpytion of keys. Use random secret key.
    disableBackup: false, //Only for Android(optional)
    localizedFallbackTitle: 'Use Pin', //Only for iOS
    localizedReason: 'Por favor, realice una autenticación para continuar' //Only for iOS
  }
  options1: AnimationOptions;
  options2: AnimationOptions;
  @Input() type;
  @Input() template;
  @Input() title;
  @Input() img;
  @Input() subTitle;

  constructor(private faio: FingerprintAIO, private modalController: ModalController) {
    this.options1 = {
      path: './assets/lottie/protect-your-data.json'
    }
    this.options2 = {
      path: './assets/lottie/biometric-sign-in.json'
    }
  }

  ionViewWillEnter() {
    this.verifyType();
  }

  verifyType() {
    if (this.type == 'bio')
      this.verifyFirst();
    else
      this.alertModal();
  }

  alertModal() {
    if (this.img) {
      this.img_bool = true;
    } else {
      this.img_bool = false;
    }

    setTimeout(() => {
      this.modalController.dismiss();
    }, 6000)

  }

  bioMethod() {
    this.faio.isAvailable().then(s => {
      this.faio.show(this.options).then((result: any) => {
        console.log(result)
        this.modalController.dismiss();
      }).catch((error: any) => console.log(error));
    }).catch(e => {
      this.modalController.dismiss();
    })

  }

  verifyFirst() {
    let permission = localStorage.getItem('P');
    if (permission == null) {
      this.fist_time = false;
    } else {
      if (permission == 'true') {
        this.fist_time = true;
        this.bioMethod();
      } else {
        this.fist_time = false;
      }
    }
  }

  aceptar() {
    localStorage.setItem('P', 'true');
    this.bioMethod();
  }

  denegar() {
    localStorage.setItem('P', 'false');
    this.modalController.dismiss();
  }

}