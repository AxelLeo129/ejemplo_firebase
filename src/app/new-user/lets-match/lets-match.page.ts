import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  NavController,
  PopoverController,
  ActionSheetController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup,
  FormControl
} from '@angular/forms';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  DpiPopoverPage
} from './../../components/dpi-popover/dpi-popover.page';
import {
  UtilitiesService
} from './../../services/utilities.service';
import {
  FileService
} from './../../services/file.service';
import {
  AuthService
} from './../../services/auth.service';
import {
  Subscription
} from 'rxjs';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  GeneralService
} from './../../services/general.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-lets-match',
  templateUrl: './lets-match.page.html',
  styleUrls: ['./lets-match.page.scss'],
})
export class LetsMatchPage implements OnInit, OnDestroy {

  matchForm: FormGroup;

  public errorMessages = {
    genre: {
      type: 'required',
      message: this.translate.instant('ADDPAYMENT.Error')
    },
    age: {
      type: 'required',
      message: this.translate.instant('ADDPAYMENT.Error')
    },
    birth: {
      type: 'required',
      message: this.translate.instant('ADDPAYMENT.Error')
    },
    schedule: {
      type: 'required',
      message: this.translate.instant('ADDPAYMENT.Error')
    },
    son: {
      type: 'required',
      message: this.translate.instant('ADDPAYMENT.Error')
    }
  }

  fecha_hoy: any;
  public dpi: any;
  id: string;
  objM: any;
  user_subscription: Subscription;
  schedules_subscription: Subscription;
  objU: any;
  schedules: any;
  uid: string;

  constructor(private alertController: AlertController,
    private dbF: AngularFirestore,
    private generalService: GeneralService, private loadingController: LoadingController, private auth: AngularFireAuth, private http: HttpClient, private authService: AuthService, private navController: NavController, private translate: TranslateService, private popoverController: PopoverController, private actionSheetContoller: ActionSheetController, private fileService: FileService) {
    this.matchForm = this.createForm();
  }

  ngOnInit() {
    this.getShedules();
    this.fecha_hoy = this.getDate();
    this.getCurrentUser();
  }

  ngOnDestroy() {
    this.user_subscription.unsubscribe();
    this.schedules_subscription.unsubscribe();
  }

  createForm() {
    return new FormGroup({
      'genre': new FormControl('M', [Validators.required]),
      'age': new FormControl('mayor', [Validators.required]),
      'birth': new FormControl('', [Validators.required]),
      'schedule': new FormControl('', [Validators.required]),
      'son': new FormControl('no', [Validators.required])
    })
  }

  getCurrentUser() {
    let user_s = this.authService.getCurrentUser();
    this.user_subscription = user_s.subscribe((res: any) => {
      this.uid = res.uid;
      this.getCurrentUserDB(res.uid);
    });
  }

  getCurrentUserDB(id: string) {
    let user_db = this.authService.getCurrentUserDB(id);
    user_db.subscribe((res: any) => {
      this.objU = res;
    })
  }

  getShedules() {
    let schedule_observable = this.generalService.getCollection('horarios', "orden", "asc");
    this.schedules_subscription = schedule_observable.subscribe((res: any) => {
      this.schedules = res;
      //console.log(res);
    });
  }

  correo_guardian_legal: string;
  getDate() {
    let fecha = new Date();
    let obtener;
    let n = fecha.getDate();
    let o = (fecha.getMonth() + 1);
    let m = o.toString();
    let l = n.toString();
    if (l.length == 1) {
      l = "0" + l;
    }
    if (m.length == 1) {
      m = "0" + m;
    }
    obtener = (fecha.getFullYear() - 15) + "-" + m + "-" + l;
    return obtener.toString();
  }

  async setFilters() {
    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });
    if (this.matchForm.value.genre == 'sin-preferencia' || this.matchForm.value.genre == 'otro') {
      this.matchForm.value.genre = ''
    }
    let get_temas = JSON.parse(localStorage.getItem('areas'));
    let temas_ids = [];
    get_temas.temas1.forEach(element => {
      temas_ids.push(element.id);
    });
    get_temas.temas2.forEach(element => {
      temas_ids.push(element.id);
    });
    //console.log(get_temas);
    localStorage.setItem('schedule', JSON.stringify(this.matchForm.value.schedule));
    //console.log(this.matchForm.value.schedule);
    let objS = {};
    this.schedules.forEach(element => {
      if (element.id1 == this.matchForm.value.schedule) {
        objS = element;
      }
    });
    localStorage.setItem('schedule1', JSON.stringify(objS));
    let fecha = new Date().getTime();
    let fC = new Date(this.matchForm.value.birth)

    this.objM = {
      genre: this.matchForm.value.genre,
      age: this.matchForm.value.age,
      horario: this.matchForm.value.schedule,
      temas: temas_ids,
      horaBusqueda: fecha,
      fecha_nacimiento: fC.getTime(),
      userId: this.uid
    }


    this.dbF.collection("usuarios").doc((await this.auth.currentUser).uid).update({
      fecha_nacimiento: fC.getTime(),
      genero: this.matchForm.value.genre
    })

    if (this.objU.parent_dpi && this.objU.parent_name) {


      let l = await this.presentLoading();
      console.log(this.objM);
      this.http.post('https://us-central1-mimento-app.cloudfunctions.net/api/filter', this.objM, {
        headers: headers
      }).toPromise().then(res => {
        //localStorage.removeItem('areas');
        l.dismiss();
        console.log(res)
        localStorage.setItem('terapeutas', JSON.stringify(res));
        sessionStorage.setItem('rt', JSON.stringify(true));
        this.navController.navigateRoot('/match-result');
      });
      // } else if(this.matchForm.value.son == 'si' || this.checkearEdad(String(this.matchForm.value.birth)) == 5 || this.checkearEdad(String(this.matchForm.value.birth)) == 17){
    } else if (this.matchForm.value.son == 'si') {
      this.correo_guardian_legal = await this.presentAlertPrompt()
      this.presentActionSheet();
    } else {
      let l = await this.presentLoading();
      console.log(this.objM);
      this.http.post('https://us-central1-mimento-app.cloudfunctions.net/api/filter', this.objM, {
        headers: headers
      }).toPromise().then(res => {
        l.dismiss();
        console.log(res)
        localStorage.setItem('terapeutas', JSON.stringify(res));
        sessionStorage.setItem('rt', JSON.stringify(true));
        this.navController.navigateRoot('/match-result');
      });
    }
  }

  async presentPopover(ev?: any) {
    const popover = await this.popoverController.create({
      component: DpiPopoverPage,
      event: ev,
      translucent: false,
      backdropDismiss: true
    });

    await popover.present();
  }
  presentAlertPrompt(): Promise<string> {
    return new Promise(async (res, rej) => {
      const alert = await this.alertController.create({
        header: this.translate.instant("GuardianModal.TitleEmail"),
        inputs: [
          {
            name: 'correo',
            type: 'email',
            placeholder: this.translate.instant("GuardianModal.PlaceholderEmail")
          }
        ],
        buttons: [
          {
            text: this.translate.instant("ALERT.button"),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => rej(true)
          }, {
            text: 'Aceptar',
            handler: (r) => {
              if (this.validateEmail(r.correo)) {
                res(r.correo)
              } else {
                return this.presentAlertPrompt()
              }
            }
          }
        ]
      });

      await alert.present();
    });
  }
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  async presentActionSheet() {
    const alert = await this.alertController.create({
      message: this.translate.instant('GuardianModal.ActionSheetTitle'),
      inputs: [
        {
          name: 'name_parent',
          type: 'text',
          value: '',
          placeholder: this.translate.instant('GuardianModal.NameGuardian')
        },
        {
          name: 'dpi_number',
          type: 'number',
          value: '',
          placeholder: this.translate.instant('GuardianModal.DPIGuardian')
        }
      ],
      buttons: [
        {
          text: this.translate.instant("ALERT.button"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.translate.instant("ALERT.button1"),
          handler: (value) => {
            if (value.name_parent != '' || value.dpi_number != '') {
              this.changeListener(value.name_parent, value.dpi_number);
            } else {
              this.presentAlert1();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      message: this.translate.instant('Match.Alert_message1'),
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: '',
          placeholder: this.translate.instant('Match.Alert_input')
        }
      ],
      buttons: [
        {
          text: this.translate.instant('Match.Alert_cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.translate.instant('Match.Alert_button'),
          handler: (value) => {
            if (value.name != '') {
              localStorage.setItem('child_name', value.name);
              this.presentActionSheet();
            } else {
              this.presentAlert1();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert1() {
    const alert = await this.alertController.create({
      header: this.translate.instant('Match.Alert_title'),
      message: this.translate.instant('Match.Alert_error'),
      buttons: [this.translate.instant('Match.Alert_button')]
    });

    await alert.present();
  }

  nameControl(name: string): AbstractControl {
    return this.matchForm.get(name)
  }

  async changeListener(name?: string, dpi?: number) {
    let l = await this.presentLoading();
    /*//console.log($event)
    let f = new Date();

    let file: File = $event.target.files[0],
      fullname = file.name.split('.'),
      extension = fullname.pop()
    this.dpi = {
      file: file,
      tipo: 1,
      folder: '/documentos_identificacion',
      name: f.getTime(),
      extension
    }*/

    let token = await (await this.auth.currentUser).getIdToken(false);
    const headers = new HttpHeaders({
      'authorization': token
    });

    /*this.fileService.uploadFile(this.dpi.file, this.dpi.tipo, this.dpi.folder, this.dpi.name, this.dpi.extension).then(async (url: string) => {
      this.objU.padres_dpi_url = url;
      this.objU.correo_guardian_legal = this.correo_guardian_legal;
      this.authService.updateUser(this.objU.id, this.objU);
      //console.log(this.objM);
      
    }).catch(err => {
      console.log(err);
      l.dismiss();
    })*/
    this.objU.parent_dpi = dpi;
    this.objU.parent_name = name;
    this.authService.updateUser(this.uid, this.objU).then(() => {
      this.http.post('https://us-central1-mimento-app.cloudfunctions.net/api/filter', this.objM, {
        headers: headers
      }).toPromise().then((res: any) => {
        l.dismiss();
        console.log(res)
        if (res.length == 0) {
          this.presentAlert();
        } else {
          //localStorage.removeItem('areas');
          localStorage.setItem('terapeutas', JSON.stringify(res));
          sessionStorage.setItem('rt', JSON.stringify(true));
          this.navController.navigateRoot('/match-result');
        }
      });
    }).catch(err => {
      l.dismiss();
      console.log(err);
    })
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.translate.instant('LOADING.msg')
    });
    await loading.present();
    return loading;
  }

  regresar() {
    this.navController.navigateRoot('/need-help');
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('Match.Alert_title'),
      message: this.translate.instant('Match.Alert_message'),
      buttons: [this.translate.instant('Match.Alert_button')]
    });

    await alert.present();
  }

  get genre() {
    return this.matchForm.get('genre');
  }
  get age() {
    return this.matchForm.get('age');
  }
  get birth() {
    return this.matchForm.get('birth');
  }
  get schedule() {
    return this.matchForm.get('schedule');
  }
  get son() {
    return this.matchForm.get('son');
  }

}