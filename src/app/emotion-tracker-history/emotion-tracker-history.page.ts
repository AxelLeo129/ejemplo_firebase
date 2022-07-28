import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  ProgressService
} from '../services/progress.service';
import {
  Observable,
  Subscription
} from 'rxjs';
import {
  AuthService
} from '../services/auth.service';
import {
  TranslateService
} from '@ngx-translate/core';
import { Chart } from 'chart.js';
var size = 20;

Chart.pluginService.register({
  afterRender: async (chart) => {
    let meta = chart.getDatasetMeta(0)
    if (meta.controller._config.label !== "Resultados PERMA")
      for (let index = 0; index < 6; index++) {
        await renderImage(meta, index, chart)
      }
  }
});
let renderImage = (meta, index, chart) => {
  return new Promise((res, rej) => {
    let c = index + 1
    var yourImage = new Image()
    yourImage.src = "./assets/emociones/" + c + ".png";
    yourImage.onload = e => {
      var x = meta.data[index]._model.x;
      var y = meta.data[index]._model.y;
      chart.ctx.drawImage(yourImage, x - 16, y - 16, 32, 32)
      res(true)
    }
  })
}
@Component({
  selector: 'app-emotion-tracker-history',
  templateUrl: './emotion-tracker-history.page.html',
  styleUrls: ['./emotion-tracker-history.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class EmotionTrackerHistoryPage implements OnInit {

  items: Observable<any[]>;
  user: Observable<any>;
  user_subcribe: Subscription;
  items1: any[];
  m: string;
  y: string;
  placeholder: string;
  date_string: string;
  date_m: any;
  date_y: any;
  uid: string;
  public load: boolean = false;

  suma1: number = 0;
  suma2: number = 0;
  suma3: number = 0;
  suma4: number = 0;
  suma5: number = 0;
  suma6: number = 0;

  @ViewChild('barChart', {
    static: true
  }) barChart;
  bars: Chart;
  colorArray: any;



  constructor(private route: ActivatedRoute, private progressService: ProgressService, private authService: AuthService, private change: ChangeDetectorRef, private translate: TranslateService) {
    this.m = this.route.snapshot.params.id;
    this.y = this.route.snapshot.params.id1;
  }

  ngOnInit() {
    this.getDate();
    this.getCurrentUser();
  }

  ngOnDestroy() {
    this.user_subcribe.unsubscribe();
  }

  ionViewWillLeave() {
    this.user_subcribe.unsubscribe();
  }

  createBarChart(num1: number, num2: number, num3: number, num4: number, num5: number, num6: number, load: boolean) {
    let array_data = [num1, num2, num3, num4, num5, num6];
    //console.log([num1, num2, num3, num4, num5, num6]);
    let biggest_element: number = 0;
    array_data.forEach((element: number) => {
      if (element) {
        biggest_element += element;
      }
    });

    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',

      data: {

        labels: [this.translate.instant('EMOTIONTRACKER.Moods.Mood1'), this.translate.instant('EMOTIONTRACKER.Moods.Mood2'), this.translate.instant('EMOTIONTRACKER.Moods.Mood3'), this.translate.instant('EMOTIONTRACKER.Moods.Mood4'), this.translate.instant('EMOTIONTRACKER.Moods.Mood5'), this.translate.instant('EMOTIONTRACKER.Moods.Mood6'), ""],
        datasets: [{
          label: this.translate.instant('EMOTIONTRACKER.Title1'),
          data: array_data,
          fill: false,
          pointBackgroundColor: '#fff',
          //pointStyle: [yourImage1, yourImage2, yourImage3, yourImage4, yourImage5, yourImage6],
          pointRadius: [14, 16, 16, 16, 16, 16],
          pointBorderColor: 'rgba(255,255,255,1)',
          pointBorderWidth: 1,
          backgroundColor: 'rgba(47, 65, 148, 1)',
          borderColor: 'rgba(47, 65, 148, 0.5)',
          borderWidth: 2,
          categoryPercentage: 1
        } as Chart.ChartDataSets]
      },

      options: {
        legend: {
          display: false
        },
        layout: {
          padding: 15
        },
        scales: {
          xAxes: [{
            gridLines: {
              offsetGridLines: false,
              display: false,
              tickMarkLength: 5
            },
            ticks: {
              fontSize: 8,
              padding: 20
            }
          }],
          yAxes: [{
            gridLines: {
              drawBorder: false,
            },
            ticks: {
              callback: function (label: number, index, labels) {
                let percentage = (label * 100) / biggest_element;
                return Math.round(percentage) + ' %';
              },
              padding: 20,
              autoSkip: true,
              maxTicksLimit: 5
            }
          }]
        },
        responsive: true,
        aspectRatio: 2
      }
    });

    this.change.detectChanges();
    this.bars.ctx.globalCompositeOperation = "source-over";
    this.bars.ctx.fillStyle = 'white';
    this.bars.ctx.globalAlpha = 1;
  }


  getNewMoods() {
    let d = new Date(this.date_string);
    let m = (d.getMonth() + 1);
    let y = d.getFullYear();
    this.date_m = m.toString();
    this.date_y = y.toString();
    this.getMoods(this.uid, this.date_m, this.date_y);
  }

  getDate() {
    this.placeholder = this.translate.instant('EMOTIONTRACKER.Months.Month' + this.m);
    this.change.detectChanges();
  }

  getCurrentUser() {
    this.user = this.authService.getCurrentUser();
    this.user_subcribe = this.user.subscribe(res => {
      try {
        this.uid = res.uid;
      } catch (err) {
        console.log(err);
      }
      this.getMoods(res.uid, this.m, this.y);
    })
  }

  getMoods(uid: string, mo: string, ye: string) {
    this.suma1 = 0;
    this.suma2 = 0;
    this.suma3 = 0;
    this.suma4 = 0;
    this.suma5 = 0;
    this.suma6 = 0;
    this.items = this.progressService.getMoods(uid);
    this.items.subscribe((res: any) => {
      this.items1 = [];
      res.forEach(element => {
        let mes_cumplimiento = element.fecha_creacion.getMonth() + 1;
        if (mes_cumplimiento == parseInt(mo) && parseInt(ye) == element.fecha_creacion.getFullYear()) {
          if (element.mood == 1) {
            this.suma1 = this.suma1 + 1;
          }
          if (element.mood == 2) {
            this.suma2 = this.suma2 + 1;
          }
          if (element.mood == 3) {
            this.suma3 = this.suma3 + 1;
          }
          if (element.mood == 4) {
            this.suma4 = this.suma4 + 1;
          }
          if (element.mood == 5) {
            this.suma5 = this.suma5 + 1;
          }
          if (element.mood == 6) {
            this.suma6 = this.suma6 + 1;
          }
          element.estado = element.mood;
          element.mood = this.translate.instant('EMOTIONTRACKER.Moods.Mood' + element.mood);
          element.fecha_creacion = element.fecha_creacion.toLocaleDateString();
          this.items1.push(element);
        }
      });
      if (this.items1.length == 0) {
        this.load = false;
      } else {
        this.load = true;
      }
      this.change.detectChanges();
      if (this.load) {
        this.createBarChart(this.suma1, this.suma2, this.suma3, this.suma4, this.suma5, this.suma6, this.load);
      }

    })
  }

}