import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  Subscription
} from 'rxjs';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  GeneralService
} from 'src/app/services/general.service';

declare var require: any
const IntroJs = require("intro.js");

@Component({
  selector: 'app-progress-list',
  templateUrl: './progress-list.page.html',
  styleUrls: ['./progress-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressListPage implements OnInit {

  placeholder: any;
  date_string: string = "";
  date_m: any;
  date_y: any;
  user_subscribe: Subscription;
  user_subcription: Subscription;
  therapist_subscription: Subscription;
  user: any;
  therapists: any;
  share: boolean = false;
  uid: string;


  monthNames =
    ["Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"]

  constructor(private router: Router, private change: ChangeDetectorRef, private translate: TranslateService, private authService: AuthService, private generalService: GeneralService) {

  }

  setTimeOutFunction: any;
  ngOnInit() {
    this.getDate();
    this.getCurrentUser();
  }
  ionViewWillLeave() {
    if (this.setTimeOutFunction)
      clearTimeout(this.setTimeOutFunction)

    if (this.intro)
      this.intro.exit()
  }

  ionViewDidLeave() {
    if (this.user_subcription) {
      this.user_subcription.unsubscribe();
    }
    if (this.user_subscribe) {
      this.user_subscribe.unsubscribe();
    }
    if (this.therapist_subscription) {
      this.therapist_subscription.unsubscribe();
    }
  }

  getCurrentUser() {
    let user_observable = this.authService.getCurrentUser();
    this.user_subscribe = user_observable.subscribe((res: any) => {
      this.uid = res.uid;
      this.getCurrentUserDB(res.uid);
    })
  }

  getCurrentUserDB(id: string) {
    let userdb_observable = this.authService.getCurrentUserDB(id);
    this.user_subcription = userdb_observable.subscribe((res: any) => {
      this.user = res;
      if (this.user.terapeuta) {
        this.share = this.user.share;
        this.getTherapists(this.user.terapeuta);
      }
      this.change.detectChanges();
    })
  }

  getTherapists(id: string) {
    let therapist_observable = this.generalService.getDoc('terapeutas', id);
    this.therapist_subscription = therapist_observable.subscribe((res: any) => {
      this.therapists = res;
      if (this.therapists) {
        this.setTimeOutFunction = setTimeout(() => {
          let visto_my_progress = localStorage.getItem("mi_Progress")
          if (!visto_my_progress) {
            this.introMethod(true);
            localStorage.setItem("mi_Progress", "true")
          }
        }, 1000);
      } else {
        this.setTimeOutFunction = setTimeout(() => {
          let visto_my_progress = localStorage.getItem("mi_Progress")
          if (!visto_my_progress) {
            this.introMethod(false);
            localStorage.setItem("mi_Progress", "true")
          }
        }, 1000);
      }
      this.change.detectChanges();
    });
  }

  getDate() {
    let d = new Date();
    let h = (d.getMonth() + 1);
    this.placeholder = this.translate.instant('PROGRESSLIST.Months.Month' + h);
    this.change.detectChanges();
  }

  moodHistory() {
    if (this.date_string == "") {
      let d = new Date();
      let m = (d.getMonth() + 1);
      let y = d.getFullYear();
      this.date_m = m;
      this.date_y = y;
    } else {
      let d = new Date(this.date_string);
      let m = (d.getMonth() + 1);
      let y = d.getFullYear();
      this.date_m = m;
      this.date_y = y;
    }
    this.router.navigate(['/emotion-tracker-history/' + this.date_m + '/' + this.date_y]);
  }

  Goals() {
    if (this.date_string == "") {
      let d = new Date();
      let m = (d.getMonth() + 1);
      let y = d.getFullYear();
      this.date_m = m;
      this.date_y = y;
    } else {
      let d = new Date(this.date_string);
      let m = (d.getMonth() + 1);
      let y = d.getFullYear();
      this.date_m = m;
      this.date_y = y;
    }
    this.router.navigate(['/goals/' + this.date_m + '/' + this.date_y]);
  }

  changeThe() {
    localStorage.setItem('The', JSON.stringify(true));
    this.router.navigate(['/need-help']);
  }

  permission() {
    this.user.share = !this.share;
    this.generalService.updateDoc('usuarios', this.user, this.uid).then(() => {
      this.getCurrentUserDB(this.uid);
    }).catch(err => console.log(err));
  }

  intro: any;
  introMethod(sub: boolean) {
    // import IntroJS
    this.intro = IntroJs();
    //console.log("inside intro.js");
    let steps = [];
    if (sub == true) {
      steps = [{
        intro: this.translate.instant("MYPROGRESSINTRO.Intro")
      },
      {
        element: '#step8',
        intro: this.translate.instant("MYPROGRESSINTRO.Time")
      },
      {
        element: "#step2",
        intro: this.translate.instant("MYPROGRESSINTRO.Share")
      },
      {
        element: "#step3",
        intro: this.translate.instant("MYPROGRESSINTRO.Change")
      },
      {
        element: "#step4",
        intro: this.translate.instant("MYPROGRESSINTRO.Mood")
      },
      {
        element: "#step5",
        intro: this.translate.instant("MYPROGRESSINTRO.Exercises")
      },
      {
        element: "#step6",
        intro: this.translate.instant("MYPROGRESSINTRO.Goals")
      },
      {
        element: "#step7",
        intro: this.translate.instant("MYPROGRESSINTRO.Quest")
      }
      ]
    } else {
      steps = [{
        intro: this.translate.instant("MYPROGRESSINTRO.Intro")
      },
      {
        element: '#step8',
        intro: this.translate.instant("MYPROGRESSINTRO.Time")
      },
      {
        element: "#step4",
        intro: this.translate.instant("MYPROGRESSINTRO.Mood")
      },
      {
        element: "#step5",
        intro: this.translate.instant("MYPROGRESSINTRO.Exercises")
      },
      {
        element: "#step6",
        intro: this.translate.instant("MYPROGRESSINTRO.Goals")
      },
      {
        element: "#step7",
        intro: this.translate.instant("MYPROGRESSINTRO.Quest")
      }
      ]
    }
    this.intro.setOptions({
      steps,
      showProgress: true,
      skipLabel: this.translate.instant("TUTOCHAT.skip"),
      doneLabel: this.translate.instant("TUTOCHAT.done"),
      nextLabel: this.translate.instant("TUTOCHAT.next"),
      prevLabel: this.translate.instant("TUTOCHAT.prev"),
      overlayOpacity: "0.8"
    });
    this.intro.start();
  }

}