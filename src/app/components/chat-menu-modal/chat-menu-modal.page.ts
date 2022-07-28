import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  ModalController,
  ToastController,
  AlertController
} from '@ionic/angular';
import {
  GeneralService
} from 'src/app/services/general.service';
import {
  TranslateService
} from '@ngx-translate/core';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-chat-menu-modal',
  templateUrl: './chat-menu-modal.page.html',
  styleUrls: ['./chat-menu-modal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMenuModalPage {

  @Input() live;
  @Input() therapist_id;
  @Input() therapist_name;
  @Input() therapist_tratamiento;
  @Input() especialidad;
  @Input() id_paquete;
  live_chat: any;
  name: string;
  tratamiento: string;
  especial: string;
  dia: string;
  fecha_inicio: string;
  fecha_fin: string;
  today_date: string;
  paquete: any;
  therapist: any;
  live_chats: any;

  constructor(private utilities: UtilitiesService,
    private alertController: AlertController, private translate: TranslateService, private generalService: GeneralService, private router: Router, private modalController: ModalController, private change: ChangeDetectorRef, private toastController: ToastController) {
    this.today_date = this.getDate();
  }

  ionViewDidEnter() {
    this.setData();
    this.getPaquete(this.id_paquete);
    this.getTherapist(this.therapist_id);
    this.getLiveChat(this.therapist_id);
  }

  getPaquete(id: string) {
    this.generalService.getDocPromise1('planes', id).then((res: any) => {
      this.paquete = res;
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

  getTherapist(id: string) {
    this.generalService.getDocPromise1('terapeutas', id).then((res: any) => {
      this.therapist = res;
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

  getLiveChat(id: string) {
    this.generalService.getCollectionWhere1Promise('cita_live', id, 'terapeuta').then((res: any) => {
      this.live_chats = res;
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
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

  setData() {
    this.especial = this.especialidad;
    this.name = this.therapist_name;
    this.tratamiento = "" //this.therapist_tratamiento;
    this.live_chat = this.live;
    console.log(this.live_chat);
    if (this.live_chat) {
      this.dia = this.live_chat.dia.toString();
      this.live_chat.hora_min_inicio.hora = this.live_chat.hora_min_inicio.hora.toString();
      this.live_chat.hora_min_inicio.min = this.live_chat.hora_min_inicio.min.toString();
      if (this.live_chat.hora_min_inicio.hora.length == 1) {
        this.live_chat.hora_min_inicio.hora = '0' + this.live_chat.hora_min_inicio.hora;
      }
      if (this.live_chat.hora_min_inicio.min.length == 1) {
        this.live_chat.hora_min_inicio.min = '0' + this.live_chat.hora_min_inicio.min;
      }
      this.live_chat.hora_min_fin.hora = this.live_chat.hora_min_fin.hora.toString();
      this.live_chat.hora_min_fin.min = this.live_chat.hora_min_fin.min.toString();
      if (this.live_chat.hora_min_fin.hora.length == 1) {
        this.live_chat.hora_min_fin.hora = '0' + this.live_chat.hora_min_fin.hora;
      }
      if (this.live_chat.hora_min_fin.min.length == 1) {
        this.live_chat.hora_min_fin.min = '0' + this.live_chat.hora_min_fin.min;
      }
      this.fecha_fin = this.live_chat.hora_min_fin.hora + ':' + this.live_chat.hora_min_fin.min;
      this.fecha_inicio = this.live_chat.hora_min_inicio.hora + ':' + this.live_chat.hora_min_inicio.min;
      this.change.detectChanges();
    }
  }

  setEnd() {
    let split = this.fecha_inicio.split(':');
    let horas = parseInt(split[0]);
    let minutos = parseInt(split[1]);
    let fecha = new Date(2020, 1, 2, horas, minutos, 0, 0);
    this.live_chat.hora_min_inicio.hora = fecha.getHours();
    this.live_chat.hora_min_inicio.min = fecha.getMinutes();
    this.live_chat.hora.min = (this.live_chat.hora_min_inicio.hora * 3600) + (this.live_chat.hora_min_inicio.min * 60);
    fecha.setMinutes(fecha.getMinutes() + this.paquete.live_minutes);
    this.fecha_fin = fecha.getHours() + ':' + fecha.getMinutes();
    this.live_chat.hora_min_fin.hora = fecha.getHours();
    this.live_chat.hora_min_fin.min = fecha.getMinutes();
    this.live_chat.hora.max = (this.live_chat.hora_min_fin.hora * 3600) + (this.live_chat.hora_min_fin.min * 60);
    this.change.detectChanges();
  }

  setLiveChat() {
    this.live_chat.dia = parseInt(this.dia);
    if (this.therapist.dias_atencion.includes(parseInt(this.dia))) {
      if (this.live_chat.hora_min_inicio.hora >= this.therapist.live_min && this.live_chat.hora_min_fin.hora < this.therapist.live_max) {
        if (this.live_chats.length > 0) {
          let cont = 0;
          this.live_chats.forEach((element: any) => {
            if (((this.live_chat.hora.min >= element.hora.min && this.live_chat.hora.min <= element.hora.max) || (this.live_chat.hora.max >= element.hora.min && this.live_chat.hora.max <= element.hora.max)) && (parseInt(this.dia) == element.dia)) {
              if (this.live_chat.id != element.id) {
                cont = cont + 1;
              }
            }
          });
          if (cont == 0) {
            this.generalService.saveDocWithoutAlert('cita_live', this.live_chat, this.live_chat.id).then(() => {
              this.modalController.dismiss();
              this.presentToast();
            }).catch(err => console.log(err));
          } else {
            this.presentAlert();
            console.log(1);
          }
        } else {
          this.generalService.saveDocWithoutAlert('cita_live', this.live_chat, this.live_chat.id).then(() => {
            this.modalController.dismiss();
            this.presentToast();
          }).catch(err => console.log(err));
        }
      } else if (this.live_chat.hora_min_inicio.hora >= this.therapist.live_min && this.live_chat.hora_min_fin.hora <= this.therapist.live_max) {
        if (this.live_chat.hora_min_fin.min == 0) {
          if (this.live_chats.length > 0) {
            let cont = 0;
            this.live_chats.forEach((element: any) => {
              if (((this.live_chat.hora.min >= element.hora.min && this.live_chat.hora.min <= element.hora.max) || (this.live_chat.hora.max >= element.hora.min && this.live_chat.hora.max <= element.hora.max)) && (parseInt(this.dia) == element.dia)) {
                if (this.live_chat.id != element.id) {
                  cont = cont + 1;
                }
              }
            });
            if (cont == 0) {
              this.generalService.saveDocWithoutAlert('cita_live', this.live_chat, this.live_chat.id).then(() => {
                this.modalController.dismiss();
                this.presentToast();
              }).catch(err => console.log(err));
            } else {
              this.presentAlert();
              console.log(3);
            }
          } else {
            this.generalService.saveDocWithoutAlert('cita_live', this.live_chat, this.live_chat.id).then(() => {
              this.modalController.dismiss();
              this.presentToast();
            }).catch(err => console.log(err));
          }
        } else {
          this.presentAlert();
          console.log(4);
        }
      } else {
        this.presentAlert();
        console.log(5);
      }
    } else {
      this.presentAlert();
      console.log(6);
    }
  }

  changeTherapist() {
    localStorage.setItem('The', JSON.stringify(true));
    this.router.navigate(['/need-help']);
    this.modalController.dismiss();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.translate.instant('PAYMENTNOTIFICATION.Title2'),
      duration: 2000
    });
    toast.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: this.translate.instant('ALERTCARD.header'),
      message: this.translate.instant('ALERTCARD.error'),
      buttons: [this.translate.instant('ALERTCARD.Button1')]
    });

    await alert.present();
  }

  async presentAlertConfirm3() {
    try {
      await this.utilities.quejaEtica()
      this.utilities.presentAlert(
        this.translate.instant('QUEJAS.DoneTitle'),
        this.translate.instant('QUEJAS.DoneMessage'))
    } catch (error) {
      console.log(error)
    }
  }
}