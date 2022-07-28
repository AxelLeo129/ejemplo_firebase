import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { UtilitiesService } from './../..//services/utilities.service';
import { GeneralService } from './../..//services/general.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from "./../../services/auth.service";
import { Subscription } from 'rxjs';
import { VibracionService } from '../../services/vibracion.service';

@Component({
  selector: 'emotion-tracker',
  templateUrl: './emotion-tracker.component.html',
  styleUrls: ['./emotion-tracker.component.scss'],
})
export class EmotionTrackerComponent implements OnInit {

  uid: string;
  auth_subscription: Subscription;

  constructor(
    private vibracionService: VibracionService,
    private utilityService: UtilitiesService, private translate: TranslateService, private generalService: GeneralService, private authService: AuthService,
    private detectChanges: ChangeDetectorRef) { }
  isOpen: boolean = false;
  optionsA: AnimationOptions = {
    path: './assets/emociones/a.json'
  };
  optionsH: AnimationOptions = {
    path: './assets/emociones/h.json'
  };
  optionsS: AnimationOptions = {
    path: './assets/emociones/s.json'
  };

  optionsAll: AnimationOptions = {
    path: './assets/emociones/pulse.json'
  };

  getCurrentUser() {
    let auth_observable = this.authService.getCurrentUser();
    this.auth_subscription = auth_observable.subscribe((res: any) => {
      this.uid = res.uid;
    });
    if (this.uid) {
      this.auth_subscription.unsubscribe();
    }
  }
  abrir() {
    this.vibracionService.vibrarAlerta();
    this.isOpen = !this.isOpen
    this.detectChanges.detectChanges();
  }
  ngOnDestroy() {
    this.auth_subscription.unsubscribe();
  }

  onClick(type: number) {

    let mt = this.setText(type)
    this.utilityService.presentAlertConfirm(this.translate.instant('HOME.Answer') + "  " + mt.toUpperCase(), this.translate.instant('HOME.Alert')).then(res => {
      if (res) {
        this.vibracionService.vibrarCorrecto();
        let fecha_hoy = new Date();
        this.generalService.saveDoc('moods', {
          mood: type,
          fecha_creacion: fecha_hoy,
          uid: this.uid
        })
      }
    }).catch(err => console.log(err));
    setTimeout(() => {
      let face = document.getElementById('menu-open');
      face.click();
    }, 300);
  }


  setText(mood: number) {
    let mood_title: string;
    switch (mood) {
      case 1:
        mood_title = this.translate.instant('HOME.moods.hostile');
        break;
      case 2:
        mood_title = this.translate.instant('HOME.moods.tired');;
        break;
      case 3:
        mood_title = this.translate.instant('HOME.moods.surprised');
        break;
      case 4:
        mood_title = this.translate.instant('HOME.moods.sad');
        break;
      case 5:
        mood_title = this.translate.instant('HOME.moods.angry');
        break;
      case 6:
        mood_title = this.translate.instant('HOME.moods.happy');
        break;
      default:
        break;
    }
    return mood_title;
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  ngOnInit() {
    this.getCurrentUser();
  }

}
