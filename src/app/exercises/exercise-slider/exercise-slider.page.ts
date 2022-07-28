import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  Observable, Subscription
} from 'rxjs';
import {
  SurleyService
} from './../../services/surley.service';
import {
  IonSlides,
  LoadingController,
  ModalController
} from '@ionic/angular';
import {
  LanguageService
} from './../../services/language.service';
import {
  AuthService
} from './../../services/auth.service';
import {
  Platform
} from '@ionic/angular';
import {
  UtilitiesService
} from './../../services/utilities.service';
import {
  VibracionService
} from './../../services/vibracion.service';
import {
  TranslateService
} from '@ngx-translate/core';
import * as countdown from 'countdown';
import {
  ExerciseModalPage
} from './../../components/exercise-modal/exercise-modal.page';
import { trigger, transition, query, stagger, animateChild, style, animate } from '@angular/animations';

interface Time {
  minutes: number,
  seconds: number
}

@Component({
  selector: 'app-exercise-slider',
  templateUrl: './exercise-slider.page.html',
  styleUrls: ['./exercise-slider.page.scss'],
  animations: [
    // nice stagger effect when showing existing elements
    trigger('list', [
      transition(':enter', [
        // child animation selector + stagger
        query('@items',
          stagger(200, animateChild()), { optional: true }
        )
      ]),
    ]),
    trigger('items', [
      // cubic-bezier for a tiny bouncing feel
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('0.5s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('0.5s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(0.5)', opacity: 0, height: '0px', margin: '0px' }))
      ]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseSliderPage implements OnInit, OnDestroy {

  user_subscription: Subscription;
  id: string;
  public index: number;
  item: Observable<any>;
  ejercicio: any = {};
  questions: any[] = [];
  respuestas: any[] = [];
  data_res: any = {};
  data_save: any = {
    respuestas: {},
    fecha_inicio: '',
    fecha_final: '',
    usuario: '',
    ejercicio: '',
    sistema_operativo: ''
  };
  public text: string = "";
  public range: number = 0;
  @ViewChild('slides', {
    static: true
  }) slides: IonSlides;
  fecha_hoy: any;
  fecha_fin: any;
  public user: any;
  uid: string;
  userData: any;
  name_obj: any;
  public userOb: Observable<any>;
  able: boolean = true;
  fontAudio = new Audio("assets/audio/audio1.mp3");
  load: boolean = false;
  music_icon: string = "play-circle-outline";
  public play_able = true;
  public slides_number = 0;
  timerId: number = null;
  time: Time = null;
  seconds_string: string = "";
  minutes_string: string = "";
  indexes_questions: any[] = [];
  needleValue: number = 66;
  bottomLabel: string = "muchas veces";

  constructor(private modalController: ModalController,
    private loadingController: LoadingController,
    private vibracionService: VibracionService,
    private translate: TranslateService, private utilitiesService: UtilitiesService, private platform: Platform, private route: ActivatedRoute, private surleyService: SurleyService, private languageService: LanguageService, private change: ChangeDetectorRef, private router: Router, private authService: AuthService) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
    this.getLanguage();
    this.getSurley(this.id);
    this.getQuestions(this.id);
    this.getCurrentUser();
    this.fecha_hoy = new Date();
    this.bottomLabel = this.translate.instant("Gauge.much")
  }

  ngOnDestroy() {
    this.playAudio(false, false);
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.user_subscription.unsubscribe();
  }



  playAudio(bo: boolean, detect: boolean = true) {
    this.vibracionService.vibrarAlerta();
    if (bo) {
      this.music_icon = "pause-circle-outline";
      this.fontAudio.play();
      this.play_able = false;
    } else {
      this.music_icon = "play-circle-outline";
      this.fontAudio.pause();
      this.play_able = true;
    }
    if (detect) {
      this.change.detectChanges();
    }
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



  getCurrentUser() {
    this.user = this.authService.getCurrentUser();
    this.user_subscription = this.user.subscribe(res => {
      try {
        this.uid = res.uid;
      } catch (err) {
        console.log(err);
      }
      this.getCurrentUserDB(this.uid);
    })
  }

  getCurrentUserDB(id: string) {
    this.userOb = this.authService.getCurrentUserDB(id);
    this.userOb.subscribe(res => {
      this.userData = res;
    })
  }

  timmer(seconds: number) {
    let fecha = new Date();
    let n = fecha.getTime();
    this.timerId = countdown((n + seconds), (ts) => {
      let fecha1 = new Date();
      let n1 = fecha1.getTime();
      this.time = ts;
      this.seconds_string = this.time.seconds.toString();
      this.minutes_string = this.time.minutes.toString();
      if (this.seconds_string.length == 1) {
        this.seconds_string = '0' + this.seconds_string;
      }
      if (this.minutes_string.length == 1) {
        this.minutes_string = '0' + this.minutes_string;
      }
      if (n1 >= (n + seconds)) {
        clearInterval(this.timerId);
      }
      this.change.detectChanges();
    }, countdown.MINUTES | countdown.SECONDS)
  }

  getSurley(id) {
    this.surleyService.getEncuesta(id).then(res => {
      let data = res.data();
      let id1 = res.id;
      data.id1 = id1;
      if (data.cloudinary_audio) {
        this.fontAudio = new Audio(data.cloudinary_audio);
      }
      data.seconds = data.tiempo;
      data.tiempo = (data.tiempo / 60000);
      data.tiempo = Math.round(data.tiempo);
      data.texto1 = data.texto;
      data.texto = data.texto[this.index];
      data.descripcion = data.descripcion[this.index];
      this.ejercicio = data;
      this.change.detectChanges();
    });
  }

  getQuestions(id) {
    this.surleyService.getPreguntas(id).then(res => {
      let cont = 0;
      let index = 1;
      let cont1 = 0;
      res.forEach(element => {
        let dato: any = element.data();
        dato.id = element.id;
        dato.texto = dato.texto[this.index];
        if (dato['depend']) {
          cont1 = cont1 + 1;
          dato.index = '';
        } else {
          dato.index = index;
          index = index + 1;
        }
        cont = cont + 1;
        this.indexes_questions.push(dato.id);
        this.questions.push(dato);
      });
      //console.log(this.questions, this.indexes_questions);
      this.change.detectChanges();
      this.slides_number = cont - cont1;
    })
  }

  setInfo(objP: any, objR: any, numero: number, a: number) {
    //console.log(objP, objR, numero, a);
    let llaveP = objP.id;
    let llaveR = objR.id;
    if (this.data_res[llaveP]) {
      if (this.data_res[llaveP].includes(objR)) {
        let ind = this.data_res[llaveP].indexOf(llaveR)
        this.data_res[llaveP].splice(ind, 1);
        this.respuestas[a].selected = false;
      } else {
        this.data_res[llaveP].push(objR);
        this.respuestas[a].selected = true;
      }
    } else {
      this.data_res[llaveP] = [];
      this.data_res[llaveP].push(objR);
      this.respuestas[a].selected = true;
      if (objP.multiple === false && objR.next) {
        let index_slide = (this.indexes_questions.indexOf(objR.next) + 1);
        let variable_range = 0;
        do {
          if (this.questions[index_slide].depend == false) {
            variable_range = 1;
          } else {
            index_slide = index_slide + 1;
          }
        } while (variable_range == 0);
        //console.log(index_slide);
        this.nextSlide(numero, 'M', {}, index_slide);
      } else if (objP.multiple === false) {
        this.nextSlide(numero, 'M', {});
      }
    }
    this.change.detectChanges();
  }

  getAnswers(id, id1) {
    this.surleyService.getRespuestas(id, id1).then(res => {
      this.respuestas = [];
      res.forEach(e => {
        let dato: any = e.data();
        dato.id = e.id;
        dato.selected = false;
        this.respuestas.push(dato);
      })
      this.change.detectChanges();
    })
  }

  siguienteSlide() {
    this.vibracionService.vibrarAlerta();
    this.slides.lockSwipes(false);
    this.slides.slideNext();

    this.slides.lockSwipes(true);
  }

  siguenteSlide1(index: number) {
    this.vibracionService.vibrarAlerta();
    this.slides.lockSwipes(false);
    this.slides.slideTo(index);
    this.slides.lockSwipes(true);
  }

  anteriorSlide(i: number) {
    this.vibracionService.vibrarAlerta();
    let obj_prev: any = this.questions[i - 1];
    if (obj_prev.depend == true) {
      /*let id = this.questions[i - 2].id;
      if(obj_prev.tipo == 'R'){
        this.range = this.data_res[id].respuesta;
      } else if(obj_prev.tipo == 'L'){
        this.text = this.data_res[id].respuesta;
      } else if (obj_prev.tipo == 'M'){
        this.respuestas.forEach(element => {
          console.log(element);
          this.data_res[id].forEach(e => {
            if(element.id == e.id){
              element.selected = true;
            }
          });
        }) 
      }*/
      delete this.data_res[obj_prev.id];
      this.slides.lockSwipes(false);
      this.slides.slideTo(i - 1);
      this.slides.lockSwipes(true);
    } else {
      /*let id = this.questions[i - 1].id;
      if(obj_prev.tipo == 'R'){
        this.range = this.data_res[id].respuesta;
      } else if(obj_prev.tipo == 'L'){
        this.text = this.data_res[id].respuesta;
      } else if (obj_prev.tipo == 'M'){
        this.respuestas.forEach(element => {
          console.log(element);
          this.data_res[id].forEach(e => {
            if(element.id == e.id){
              element.selected = true;
            }
          });
        }) 
      }*/
      delete this.data_res[obj_prev.id];
      this.slides.lockSwipes(false);
      this.slides.slideTo(i);
      this.slides.lockSwipes(true);
    }

  }

  empezar() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
    this.timmer(this.ejercicio.seconds);
    this.vibracionService.vibrarAlerta();
    this.playAudio(true);
  }

  actualSlide = "";
  nextSlide(i: number, tipo: string, objP: any, optional: number = 0) {
    //console.log(i, tipo, objP, optional);
    this.actualSlide = objP.id;
    //console.log(this.actualSlide)
    this.change.detectChanges();
    if (i < (this.questions.length - 1)) {
      let obj_next: any = this.questions[i + 1];
      if (tipo == 'E') {
        objP.respuesta = this.range;
        this.data_res[objP.id] = objP;
        this.range = 0;
        if (obj_next.depend == true) {
          this.siguenteSlide1(i + 3);
        } else {
          this.siguienteSlide();
        }
      } else if (tipo == 'L' || tipo == 'C') {
        objP.respuesta = this.text;
        this.data_res[objP.id] = objP;
        this.text = "";
        this.needleValue = 88;
        this.bottomLabel = "muchas veces"
        if (obj_next.depend == true) {
          this.siguenteSlide1(i + 3);
        } else {
          this.siguienteSlide();
        }
      } else if (tipo == 'M' && optional != 0) {
        this.slides.lockSwipes(false);
        this.slides.slideTo(optional);
        this.slides.lockSwipes(true);
      } else {
        if (obj_next.depend == true) {
          this.siguenteSlide1(i + 3);
        } else {
          this.siguienteSlide();
        }
      }
    } else {
      //this.presentLoading();
      this.fecha_fin = new Date();
      if (tipo == 'E') {
        objP.respuesta = this.range;
        this.data_res[objP.id] = objP;
      } else if (tipo == 'L' || tipo == 'C') {
        objP.respuesta = this.text;
        this.data_res[objP.id] = objP;
      }
      this.data_save.clase = this.ejercicio.clase;
      this.data_save.texto = this.ejercicio.texto1;
      this.data_save.ejercicio = this.ejercicio.id1;
      this.data_save.fecha_inicio = this.fecha_hoy.getTime();
      this.data_save.respuestas = this.data_res;
      this.data_save.usuario = this.uid;
      this.data_save.fecha_final = this.fecha_fin.getTime();
      this.data_save.sistema_operativo = this.platform.platforms();
      this.surleyService.saveRespuesta(this.data_save).then(() => {
        this.fontAudio.pause();
        //this.loadingController.dismiss();
        this.utilitiesService.presentToast(2000, this.translate.instant('GENERALSERVICE.Ok_toast_message'));
        this.presentModal();
      }).catch(err => {
        this.fontAudio.pause();
        //this.loadingController.dismiss();
        this.utilitiesService.presentAlert('Error', err.message);
      });
    }
  }

  async presentModal() {
    this.vibracionService.vibrarCorrecto();
    const modal = await this.modalController.create({
      component: ExerciseModalPage,
      swipeToClose: true,
      componentProps: {
        UserData: this.userData,
        ejercicio: this.ejercicio,
        data_res: this.data_res,
        questions: this.questions,
        index: this.index
      }
    });
    await modal.present();

    const value = await modal.onDidDismiss();

    if (value.data) {
      this.empezar();
    }

  }

  goHome() {
    this.router.navigate(['/ejercicios/principales/ejercicios']);
  }

  slideChanged() {
    this.slides.getActiveIndex().then((index: number) => {
      try {
        let iden = this.questions[(index - 1)].id;
        this.getAnswers(this.id, iden)
      } catch (err) {
        //console.log(err)
      }
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('LOADING.msg'),
    });
    await loading.present();
  }

  getLabelText(range: number): string {
    switch (range) {
      default:
        return this.translate.instant("VerticalSlider.not")
      case 2:
        return this.translate.instant("VerticalSlider.not_to_much")
      case 3:
        return this.translate.instant("VerticalSlider.some")
      case 4:
        return this.translate.instant("VerticalSlider.much")
      case 5:
        return this.translate.instant("VerticalSlider.to_much")
    }
  }

  ranger(numero: number = 1) {
    this.range = numero;
    switch (numero) {
      case 5:
        this.vibracionService.vibrarImpacto()
        break;
      case 4:
      case 3:
        this.vibracionService.vibrarMedio()
        break;
      default:
        this.vibracionService.vibrarAlerta()
        break;
    }
  }

  setGaugeInfo(valor: number) {
    switch (valor) {
      case 1:
        this.text = this.translate.instant("Gauge.much")
        this.text = "nunca"
        this.needleValue = 12
        break;
      case 2:
        this.text = this.translate.instant("Gauge.some")
        this.needleValue = 37
        break;
      case 3:
        this.text = this.translate.instant("Gauge.much")
        this.needleValue = 66
        break;
      case 4:
        this.text = this.translate.instant("Gauge.always")
        this.needleValue = 88
      default:
        break;
    }
    this.bottomLabel = this.text
    this.change.detectChanges()
  }
}