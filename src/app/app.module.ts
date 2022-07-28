import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, iosTransitionAnimation } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Firestore
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
//ngx-translate
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguagePopoverPageModule } from './language-popover/language-popover.module';
//Extras
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Device } from "@ionic-native/device/ngx";
import { NgxImageCompressService } from 'ngx-image-compress';
import { Platform } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { BioModalPageModule } from './components/bio-modal/bio-modal.module';

import { BioModalPage } from './components/bio-modal/bio-modal.page';
import { ChartsModule } from 'ng2-charts';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Deeplinks } from "@ionic-native/deeplinks/ngx";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function playerFactory() {
  return player;
}

import { NgxMaskModule, IConfig } from 'ngx-mask'
const maskConfig: Partial<IConfig> = {
  validation: false,
};
import { Ng5SliderModule } from 'ng5-slider';
import { File } from '@ionic-native/file/ngx';
import { Media } from '@ionic-native/media/ngx';

import { TapticEngine } from '@ionic-native/taptic-engine/ngx';
import { DeviceFeedback } from '@ionic-native/device-feedback/ngx';

import { GaugeChartModule } from 'angular-gauge-chart'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [
    BioModalPage
  ],
  imports: [
    BrowserAnimationsModule,
    AngularFireAnalyticsModule,
    BioModalPageModule,
    GaugeChartModule,
    AngularFireStorageModule,
    HttpClientModule,
    BrowserModule,
    ChartsModule,
    IonicModule.forRoot({
      mode: 'md',
      scrollAssist: false,
      scrollPadding: false,
      swipeBackEnabled: false
    }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    LanguagePopoverPageModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    LottieModule.forRoot({ player: playerFactory }),
    NgxMaskModule.forRoot(maskConfig),
    Ng5SliderModule,

  ],
  providers: [
    FingerprintAIO,
    Platform,
    StatusBar,
    SplashScreen,
    LottieSplashScreen,
    ScreenTrackingService,
    UserTrackingService,
    AngularFireAuthGuard,
    Geolocation,
    OneSignal,
    Deeplinks,
    Device,
    File,
    NgxImageCompressService,
    Media,
    DeviceFeedback,
    TapticEngine,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
