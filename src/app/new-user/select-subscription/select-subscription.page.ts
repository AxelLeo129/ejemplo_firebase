import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild
} from '@angular/core';
import {
  AuthService
} from 'src/app/services/auth.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { LanguageService } from 'src/app/services/language.service';
import { NavController, IonSlides } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-subscription',
  templateUrl: './select-subscription.page.html',
  styleUrls: ['./select-subscription.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectSubscriptionPage {

  @ViewChild('slides', { static: true }) slide: IonSlides;
  suscriptions: any;
  uid: string;
  user: any;
  free_try: boolean = false;
  index: number;
  idT: string;

  constructor(private route: ActivatedRoute, private authService: AuthService, private change: ChangeDetectorRef, private navController: NavController, private subscriptionsService: SubscriptionsService, private languageService: LanguageService) {
    this.idT = this.route.snapshot.params.id;
  }

  ionViewDidEnter() {
    this.getUser();
    this.getLanguage();
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

  getUser() {
    this.authService.getCurrentUserPromise().then((res: any) => {
      this.uid = res.uid;
      this.getCurrentUserDB(this.uid);
    }).catch((err: any) => console.log(err));
  }

  getCurrentUserDB(id: string) {
    this.authService.getUserPromiseDB(id).then((res: any) => {
      this.user = res;
      if (this.user.free_trial) {
        this.free_try = true;
      }
      this.getSubsctiptions(this.free_try);
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

  getSubsctiptions(verify: boolean) {
    this.subscriptionsService.getSubscriptions(verify).then((res: any) => {
      this.suscriptions = res.sort(this.compare_item);
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

  compare_item(a, b) {
    if (a.orden < b.orden) {
      return -1;
    } else if (a.orden > b.orden) {
      return 1;
    } else {
      return 0;
    }
  }

  summary(id: string) {
    this.navController.navigateRoot(['/subscription-summary/' + id + '/' + this.idT]);
  }

  regresar() {
    this.slide.getActiveIndex().then(s => {
      if (s === 1) {
        this.slide.lockSwipes(false);
        this.slide.slideTo(0, 300)
        this.slide.lockSwipes(true);
      } else {
        let rt:boolean = JSON.parse(sessionStorage.getItem('rt'));
        if(rt)
          this.navController.navigateRoot('/match-result');
        else 
          this.navController.navigateRoot('/need-help');
      }
    })
  }
}