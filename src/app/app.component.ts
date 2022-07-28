import {
  Component
} from '@angular/core';

import {
  Platform,
  ModalController
} from '@ionic/angular';
import {
  SplashScreen
} from '@ionic-native/splash-screen/ngx';
import {
  StatusBar
} from '@ionic-native/status-bar/ngx';
import {
  LanguageService
} from './services/language.service';
import {
  OnesignalService
} from './services/onesignal.service';
import {
  FingerprintAIO
} from '@ionic-native/fingerprint-aio/ngx';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  BioModalPage
} from './components/bio-modal/bio-modal.page';
import {
  AngularFireDatabase
} from '@angular/fire/database';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  usuario: firebase.User;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private languageService: LanguageService,
    private push: OnesignalService,
    private faio: FingerprintAIO,
    private modalController: ModalController,
    public auth: AngularFireAuth,
    private deeplinks: Deeplinks,
    private database: AngularFireDatabase,
    private route: Router,
    private lottieSplashScreen: LottieSplashScreen,

  ) {
    this.initializeApp();

    this.auth.authState.subscribe((res: firebase.User) => {
      this.usuario = res;
      if (res) {
        setTimeout(() => {

          var myConnectionsRef = this.database.database.ref('conectados').child(res.uid);
          var connectedRef = this.database.database.ref('.info/connected');
          connectedRef.on('value', function (snap) {
            if (snap.val() === true) {
              var con = myConnectionsRef;
              con.onDisconnect().remove();
              con.update({ conectado: true });
            }
          });
        }, 100);
      }
    })
  }
  isBackground: boolean = false;
  initializeApp() {

    this.platform.ready().then(() => {
      this.splashScreen.hide();
      let permission = localStorage.getItem('P');
      this.push.init();
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#fffbf6');

      setTimeout(() => {
        if (!this.platform.is("desktop")) {
          this.lottieSplashScreen.hide();
        }
      }, 1000);
      this.languageService.setInitialAppLanguage();

      this.platform.resume.subscribe(() => {
        this.isBackground = false;



      });

      this.platform.pause.subscribe(() => {
        this.isBackground = true;
      });


    });

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: BioModalPage,
      componentProps: {
        type: 'bio',
      },
      backdropDismiss: false
    });

    await modal.present();

  }

  initDeepLinking() {
    this.deeplinks.route({
      "/survey": "SurveyAnsweringPage"
    }).subscribe((match) => {
      console.log('Successfully matched route');
      window.location.href = match.$route
    }, (nomatch) => {

      if (nomatch && nomatch.$link && nomatch.$link.path) {
        console.log(nomatch.$link)
        this.route.navigate([nomatch.$link.path])
      }
    });
  }
}