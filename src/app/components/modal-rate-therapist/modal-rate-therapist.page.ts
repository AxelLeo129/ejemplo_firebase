import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { GeneralService } from './../../services/general.service';
import { UtilitiesService } from './../../services/utilities.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-rate-therapist',
  templateUrl: './modal-rate-therapist.page.html',
  styleUrls: ['./modal-rate-therapist.page.scss'],
})
export class ModalRateTherapistPage implements OnInit {

  @Input() usuario: string;
  @Input() terapeuta: string;
  terapeuta_correo: string;
  usuario_correo: string;
  validacion_terapueta: boolean = true;
  validacion_app: boolean = true;
  calificacion_form: FormGroup;
  c_a_n: number = 3;  // Valor numérico de la calificación;
  c_t_n: number = 3;  // Valor numérico del terapeuta;
  constructor(private modalController: ModalController,
    private change: ChangeDetectorRef,
    private generalService: GeneralService, private utilitiesService: UtilitiesService, private translate: TranslateService) {
    this.calificacion_form = this.createFormGroup();
  }

  ngOnInit() {
    console.log(this.usuario)
    this.getUser(this.usuario);
  }

  createFormGroup() {
    return new FormGroup({
      'calificacion_app': new FormControl('', []),
      'calificacion_terapeuta': new FormControl('', []),
      'comentario_app': new FormControl('', [Validators.required]),
      'comentario_terapeuta': new FormControl('', []),
      "comentario_terapeuta_select": new FormControl(""),
      "calificacion_recomendacion_app": new FormControl(5),
      "calificacion_recomendacion_terapeuta": new FormControl(5),
    });
  }

  getUser(id: string) {
    this.generalService.getDocPromise('usuarios', id).then((res: any) => {
      let data = res.data()
      this.usuario_correo = data.correo;
      this.terapeuta = data.terapeuta;
      if (this.terapeuta)
        this.getTherapist(this.terapeuta);
    }).catch(err => console.log(err))
  }

  getTherapist(id: string) {
    this.generalService.getDocPromise('terapeutas', id).then((res: any) => {
      this.terapeuta_correo = res.data().correo;
    }).catch(err => console.log(err))
  }

  regresar() {
    this.modalController.dismiss();
  }

  setRate() {
    let fecha = new Date().getTime();
    if (!this.c_a_n || !this.c_t_n
      || (this.c_t_n === 5 && !this.calificacion_form.value.comentario_terapeuta_select)
      || !this.calificacion_form.value.comentario_app) {
      this.utilitiesService.presentAlert(this.translate.instant("ALERTS.Form_not_complete_title"), this.translate.instant("ALERTS.Form_not_complete_label"))
      return
    }

    let objC = {
      calificacion_app: this.c_a_n,
      calificacion_terapeuta: this.c_t_n,
      calificacion_recomendacion_app: this.calificacion_form.value.calificacion_recomendacion_app,
      calificacion_recomendacion_terapeuta: this.calificacion_form.value.calificacion_recomendacion_terapeuta,
      comentario_app: this.calificacion_form.value.comentario_app || "",
      comentario_terapeuta: this.calificacion_form.value.comentario_terapeuta_select ?
        this.calificacion_form.value.comentario_terapeuta_select === "4" ?
          this.calificacion_form.value.comentario_terapeuta :
          this.calificacion_form.value.comentario_terapeuta_select :
        this.calificacion_form.value.comentario_terapeuta,
      fecha,
      terapeuta: this.terapeuta || "",
      terapeuta_correo: this.terapeuta_correo || "",
      usuario: this.usuario,
      usuario_correo: this.usuario_correo
    }
    this.generalService.saveDoc1('calificaciones', objC).then(() => {
      this.modalController.dismiss();
      this.utilitiesService.presentAlert(this.translate.instant("ALERTS.Thanks_title"), this.translate.instant("ALERTS.Thanks_label"));
      this.calificacion_form.reset()
    }).catch(err => {
      this.modalController.dismiss();
      this.utilitiesService.presentAlert('Error', err.message);
    });
  }

  activarOtroComentario() {
    if (this.calificacion_form.value.comentario_terapeuta_select === "4") {
      this.validacion_terapueta = true;
    }
  }

  cambiarValidacionTerapeuta(numero: number) {
    this.c_t_n = numero
    if (numero == 5) {
      this.validacion_terapueta = false;
    } else {
      this.validacion_terapueta = true;
    }
    this.calificacion_form.controls['comentario_terapeuta'].setValue('');
    this.change.detectChanges();
  }

  cambiarValidacionApp() {
    if (this.calificacion_form.value.calificacion_app == 5) {
      this.validacion_app = false;
    } else {
      this.validacion_app = true;
    }
    this.calificacion_form.value.comentario_app = '';
  }
  getTextValue(numero: number) {
    switch (numero) {
      case 1:
        return "muy mal";
      case 2:
        return "mal";
      case 3:
        return "bien";
      case 4:
        return "muy bien";
      case 5:
        return "excelente";
    }
  }
  get calificacion_app() { return this.calificacion_form.get('calificacion_app'); }
  get calificacion_terapeuta() { return this.calificacion_form.get('calificacion_terapeuta'); }
  get comentario_app() { return this.calificacion_form.get('comentario_app'); }
  get comentario_terapeuta() { return this.calificacion_form.get('comentario_terapeuta'); }
  get comentario_terapeuta_select() { return this.calificacion_form.get('comentario_terapeuta_select'); }
}
