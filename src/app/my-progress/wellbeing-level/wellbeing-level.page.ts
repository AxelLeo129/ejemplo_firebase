import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { GeneralService } from './../../services/general.service';
import { Observable, Subscription } from 'rxjs';
import { LanguageService } from './../../services/language.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-wellbeing-level',
  templateUrl: './wellbeing-level.page.html',
  styleUrls: ['./wellbeing-level.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WellbeingLevelPage implements OnInit, OnDestroy {

  public index: number;
  test_tab: string = 'cuestionarios';
  items_observable: Observable<any[]>;
  items: any[] = [];
  items_subscription: Subscription;
  @ViewChild('barChart', { static: true }) barChart;
  bars: any;
  colorArray: any;
  auth_subscription: Subscription;
  resultados: any;
  uid: string;

  constructor(private authService: AuthService, private generalService: GeneralService, private languageService: LanguageService, private change: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.getLanguage();
    this.getCurrentUser();
    this.getData();
  }

  ngOnDestroy() {
    this.items_subscription.unsubscribe();
  }

  getCurrentUser() {
    let auth_observable = this.authService.getCurrentUser();
    this.auth_subscription = auth_observable.subscribe((res: any) => {
      this.uid = res.uid;
      this.getResultados(this.uid);
    });
  }

  getResultados(id: string) {
    let resultados_observable = this.generalService.getDoc('resultados_cuestionarios', id);
    resultados_observable.subscribe((res: any) => {
      this.resultados = res;
      this.createBarChart(res.P, res.E, res.R, res.M, res.A, res.N, res.Heath, res.Global);
    });
  }

  createBarChart(P: number, E: number, R: number, M: number, A: number, N: number, Health: number, Global: number) {
    //console.log([num1, num2, num3, num4, num5, num6]);
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: this.index === 0 ? ['P', 'E', 'R', 'M', 'A', 'N', 'Health', 'Global'] : ['P', 'E', 'R', 'M', 'A', 'N', 'Salud', 'Global'],
        datasets: [{
          label: 'Resultados PERMA',
          data: [P, E, R, M, A, N, Health, Global],
          backgroundColor: 'rgb(130, 109, 255)',
          borderColor: 'rgb(130, 109, 255)',
          pointStyle: "circle",
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    this.change.detectChanges();
  }


  segmentChanged() {
    this.change.detectChanges();
  }

  getLanguage() {
    this.languageService.getType().then(res => {
      if (res) {
        this.index = parseInt(res);
      } else {
        this.index = 0;
      }
      this.change.detectChanges();
    });
  }

  getData() {
    this.items = [];
    this.items_observable = this.generalService.getCollection('cuestionarios');
    this.items_subscription = this.items_observable.subscribe(res => {
      this.items = res;
      this.change.detectChanges();
    })
  }

  startTest(id: string) {
    this.router.navigate(['/questionnaire/' + id]);
  }

}
