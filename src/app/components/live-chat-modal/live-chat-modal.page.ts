import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  GeneralService
} from 'src/app/services/general.service';
import {
  MatchService
} from 'src/app/services/match.service';
import {
  AlertController, ModalController
} from '@ionic/angular';
import {
  TranslateService
} from '@ngx-translate/core';

@Component({
  selector: 'app-live-chat-modal',
  templateUrl: './live-chat-modal.page.html',
  styleUrls: ['./live-chat-modal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveChatModalPage implements OnInit {

  liveChatForm: FormGroup;
  @Input() tiempoMin;
  @Input() uid;
  @Input() therapists;
  end_live: string = '00:00';
  today_date: string;
  start_time_hour: number;
  start_time: number;
  start_time_min: number;
  end_time_hour: number;
  end_time_min: number;
  end_time: number;
  therapist: any;
  live_chat: any;

  constructor(private change: ChangeDetectorRef, private generalService: GeneralService, private matchService: MatchService, private alertController: AlertController, private translate: TranslateService, private modalController: ModalController) {
    this.liveChatForm = this.createFormGroup();
    this.today_date = this.getDate();
    this.end_live = this.getDate();
  }

  ngOnInit() {
    this.getTherapist(this.therapists);
    this.getLiveChat(this.therapists);
  }

  getTherapist(id: string) {
    this.generalService.getDocPromise1('terapeutas', id).then((res: any) => {
      this.therapist = res;
      console.log(res);
    }).catch((err: any) => console.log(err));
  }

  getLiveChat(id: string) {
    this.generalService.getCollectionWhere1Promise('cita_live', 'terapeuta', id).then((res: any) => {
      this.live_chat = res;
      console.log(res);
    }).catch((err: any) => console.log(err));
  }

  setLiveChat() {
    let objL = {
      terapeuta: this.therapists,
      terminado: false,
      dia: parseInt(this.liveChatForm.value.day),
      hora: {
        max: this.end_time,
        min: this.start_time
      },
      hora_min_inicio: {
        hora: this.start_time_hour,
        min: this.start_time_min
      },
      hora_min_fin: {
        hora: this.end_time_hour,
        min: this.end_time_min
      },
      user: this.uid
    }
    this.therapist.dias_atencion = [1,2,3,4,5];
    if (this.therapist.dias_atencion.includes(parseInt(this.liveChatForm.value.day))) {
      if (this.start_time_hour >= this.therapist.live_min && this.end_time_hour < this.therapist.live_max) {
          if (this.live_chat.length > 0) {
            let cont = 0;
            this.live_chat.forEach((element: any) => {
              if (((this.start_time >= element.hora.min && this.start_time <= element.hora.max) || (this.end_time >= element.hora.min && this.end_time <= element.hora.max)) && (parseInt(this.liveChatForm.value.day) == element.dia)) {
                cont = cont + 1;
              }
            });
            if(cont == 0){
              this.generalService.saveDocWithoutAlert('cita_live', objL, (this.uid + this.therapists)).then(() => {
                this.modalController.dismiss(true);
              }).catch(err => console.log(err)); 
            } else {
              this.presentAlert("error4");
              console.log(1);
            }
          } else {
            this.generalService.saveDocWithoutAlert('cita_live', objL, (this.uid + this.therapists)).then(() => {
              this.modalController.dismiss(true);
            }).catch(err => console.log(err));
          }
      } else if (this.start_time_hour >= this.therapist.live_min && this.end_time_hour <= this.therapist.live_max) {
        if (this.end_time_min == 0) {
          if (this.live_chat.length > 0) {
            let cont = 0;
            this.live_chat.forEach((element: any) => {
              if (((this.start_time >= element.hora.min && this.start_time <= element.hora.max) || (this.end_time >= element.hora.min && this.end_time <= element.hora.max)) && (parseInt(this.liveChatForm.value.day) == element.dia)) {
                cont = cont + 1;
              }
            });
            if(cont == 0){
              this.generalService.saveDocWithoutAlert('cita_live', objL, (this.uid + this.therapists)).then(() => {
                this.modalController.dismiss(true);
              }).catch(err => console.log(err));
            } else {
              this.presentAlert("error4");
              console.log(3);
            }
          } else {
            this.generalService.saveDocWithoutAlert('cita_live', objL, (this.uid + this.therapists)).then(() => {
              this.modalController.dismiss(true);
            }).catch(err => console.log(err));
          }
        } else {
          this.presentAlert("error3");
          console.log(4);
        }
      } else {
        this.presentAlert("error3");
        console.log(5);
        console.log(this.start_time_hour, this.therapist.live_min, this.end_time_hour, this.therapist.live_max);
      }
    } else {
      this.presentAlert("error2");
      console.log(6);
    }
  }

  createFormGroup() {
    return new FormGroup({
      'day': new FormControl('', Validators.required),
      'hour': new FormControl('', Validators.required)
    })
  }

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
    obtener = fecha.getFullYear() + "-" + m + "-" + l;
    return obtener.toString();
  }

  setEnd() {
    let fecha = new Date(this.liveChatForm.value.hour);
    this.start_time_hour = fecha.getHours();
    this.start_time_min = fecha.getMinutes();
    fecha.setMinutes(fecha.getMinutes() + this.tiempoMin);
    let gh = fecha.getHours().toString();
    this.end_time_hour = fecha.getHours();
    if (gh.length == 1) {
      gh = '0' + gh;
    }
    this.end_time_min = fecha.getMinutes();
    let gm = fecha.getMinutes().toString();
    if (gm.length == 1) {
      gm = '0' + gm;
    }
    this.end_live = (gh + ':' + gm);
    this.start_time = (this.start_time_hour * 3600) + (this.start_time_min * 60);
    this.end_time = (this.end_time_hour * 3600) + (this.end_time_min * 60);
    this.change.detectChanges();
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: this.translate.instant('ALERTCARD.header'),
      message: this.translate.instant('ALERTCARD.' + msg),
      buttons: [this.translate.instant('ALERTCARD.Button1')]
    });

    await alert.present();
  }

  get day() {
    return this.liveChatForm.get('day');
  }
  get hour() {
    return this.liveChatForm.get('live');
  }

}