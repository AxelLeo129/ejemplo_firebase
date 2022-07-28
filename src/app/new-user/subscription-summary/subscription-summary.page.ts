import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from './../../services/language.service';
import { GeneralService } from './../../services/general.service';

@Component({
  selector: 'app-subscription-summary',
  templateUrl: './subscription-summary.page.html',
  styleUrls: ['./subscription-summary.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionSummaryPage {

  id: string;
  id1: string;
  subscription: any;
  index: number;
  regalo: boolean = false;

  constructor(private navController: NavController,
    private route: ActivatedRoute, private generalService: GeneralService, private change: ChangeDetectorRef, private languageService: LanguageService) {
    this.id = this.route.snapshot.params.id;
    this.id1 = this.route.snapshot.params.id1;
  }

  ionViewDidEnter() {
    this.getLanguage();
    this.getData(this.id);
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

  pay() {
    localStorage.setItem('able_days', this.subscription.dias_disponibles);
    localStorage.setItem('vigency_days', this.subscription.dias_vigencia);
    this.navController.navigateRoot('/accept-terms/' + this.id + '/' + this.id1 + '/' + this.regalo);
  }

  regresar() {
    this.navController.back();
  }

  getData(id: string) {
    this.generalService.getDocPromise1('planes', id).then((res: any) => {
      this.subscription = res;
      if (this.subscription.precio == 0 || this.subscription.precio == 0.00) {
        this.regalo = true;
      }
      this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

}
