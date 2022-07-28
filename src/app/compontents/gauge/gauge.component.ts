import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss'],
})



export class GaugeComponent implements OnInit {

  constructor(
    private translate: TranslateService,
  ) { }

  ngOnInit() {

  }

  @Input() needleValue = 66;
  @Input() bottomLabel = this.translate.instant("Gauge.much");
  public canvasWidth = 320
  public centralLabel = ''
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 300,
    arcColors: ['rgb(153,153,153)', 'rgb(252, 163, 51)', 'rgb(0, 164, 261)', 'rgb(29, 64, 151)'],
    arcDelimiters: [25, 50, 75],
    rangeLabel: ['', ''],
    needleStartValue: 50,
  }
}