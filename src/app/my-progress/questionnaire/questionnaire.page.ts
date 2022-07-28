import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionnarieService } from './../../services/questionnarie.service';
import { Observable } from 'rxjs';
import { LanguageService } from './../../services/language.service';
import { AuthService } from './../../services/auth.service';
import { NavController, ToastController } from '@ionic/angular';
import { GeneralService } from './../../services/general.service';
import { TranslateService } from '@ngx-translate/core';
import { Options } from 'ng5-slider';
@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.page.html',
  styleUrls: ['./questionnaire.page.scss'],
})
export class QuestionnairePage implements OnInit {

  index: number;
  items: Observable<any>;
  id: string;
  data: any = {
    titulo: [],
    instrucciones: [],
    preguntas: []
  };
  uid: string;
  user_subscription: any;
  minValue: number = 0;
  maxValue: number = 10;
  options: Options = {
    floor: 0,
    step: 1,
    ceil: 10,
    showTicks: true,
    showTicksValues: true,
  };
  constructor(private translate: TranslateService, private toastController: ToastController, private route: ActivatedRoute, private questionnarieService: QuestionnarieService, private languageService: LanguageService, private change: ChangeDetectorRef, private authService: AuthService, private navController: NavController, private generalService: GeneralService) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.getLanguage();
    this.getCurrentUser();
    this.getData(this.id);
  }

  getCurrentUser() {
    let user_observable = this.authService.getCurrentUser();
    this.user_subscription = user_observable.subscribe((res: any) => {
      this.uid = res.uid;
    });
  }

  getData(id: string) {
    this.items = this.questionnarieService.getQuestionnarieQuestions(id);
    this.items.subscribe((res: any) => {
      this.data.titulo = res.questionnarie.titulo;
      this.data.instrucciones = res.questionnarie.instrucciones;
      this.data.preguntas = res.questions;
      this.change.detectChanges();
    })
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

  save() {
    let P = 0;
    let cont = 0;
    let E = 0;
    let cont1 = 0;
    let R = 0;
    let cont2 = 0;
    let M = 0;
    let cont3 = 0;
    let A = 0;
    let cont4 = 0;
    let Global = 0;
    let cont5 = 0;
    let N = 0;
    let Heath = 0;
    let cont6 = 0;
    this.data.preguntas.forEach(element => {
      element.type = element.type.split('', 2);
      if (element.type[0] == 'P') {
        P = element.value + P;
        cont = cont + 1;
      }
      if (element.type[0] == 'E') {
        E = element.value + E;
        cont1 = cont1 + 1;
      }
      if (element.type[0] == 'R') {
        R = element.value + R;
        cont2 = cont2 + 1;
      }
      if (element.type[0] == 'M') {
        M = element.value + M;
        cont3 = cont3 + 1;
      }
      if (element.type[0] == 'A') {
        A = element.value + A;
        cont4 = cont4 + 1;
      }
      if (element.type[0] == 'N') {
        N = element.value + N;
        cont5 = cont5 + 1;
      }
      if (element.type[0] == 'H') {
        Heath = element.value + Heath;
        cont6 = cont6 + 1;
      }
      Global = Global + element.value;
    });
    P = Math.round(P / cont);
    E = Math.round(E / cont1);
    R = Math.round(R / cont2);
    M = Math.round(M / cont3);
    A = Math.round(A / cont4);
    N = Math.round(N / cont5);
    Heath = Math.round(Heath / cont6);
    Global = Math.round(Global / this.data.preguntas.length);
    //console.log(P, E, R, M, A, N, Heath, Global)
    let objR = {
      P, E, R, M, A, N, Heath, Global
    }
    this.generalService.saveDocWithoutAlert('resultados_cuestionarios', objR, this.uid).then(() => {
      this.navController.navigateRoot('/wellbeing-level');
      this.presentToast();
    }).catch(err => console.log(err));
  }

  restar(item: any) {
    item.value = item.value - 1;
  }

  sumar(item: any) {
    item.value = item.value + 1;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.translate.instant('PAYMENTNOTIFICATION.Title2'),
      duration: 2000
    });
    toast.present();
  }

}
