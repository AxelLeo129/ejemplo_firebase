import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  Observable, Subscription
} from 'rxjs';
import {
  MatchService
} from './../../services/match.service';
import {
  LanguageService
} from './../../services/language.service';
import { ModalController, NavController } from '@ionic/angular';
import { DescriptionSelectionPage } from './../../components/description-selection/description-selection.page';
import { AreaOptionsSelectedModalPage } from './../../components/area-options-selected-modal/area-options-selected-modal.page';

@Component({
  selector: 'app-selected-areas',
  templateUrl: './selected-areas.page.html',
  styleUrls: ['./selected-areas.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedAreasPage implements OnInit, OnDestroy {

  areas_subs1: Subscription;
  areas_subs2: Subscription;
  index: number = 1;
  fistArea: string;
  secondArea: string;
  areaSegment: string;
  items: Observable<any>;
  items1: Observable<any>;
  first_area_array: any;
  second_area_array: any;
  fist_segment: string;
  second_segment: string;
  array_selected: any[] = [];
  array_selected1: any[] = [];

  constructor(private navController: NavController, private change: ChangeDetectorRef, private route: ActivatedRoute, private matchService: MatchService, private languageService: LanguageService, private modalController: ModalController) {
    this.fistArea = this.route.snapshot.params.area;
    this.secondArea = this.route.snapshot.params.area1;
  }

  ngOnInit() {
    this.getLanguage()
    this.getAreasTemas1(this.secondArea);
    this.getAreasTemas(this.fistArea);
  }

  ngOnDestroy() {
    this.areas_subs1.unsubscribe();
    if (this.areas_subs2) {
      this.areas_subs2.unsubscribe();
    }
  }

  segmentChanged() {
    this.change.detectChanges();
  }

  getLanguage() {
    this.languageService.getType().then(res => {
      console.log(res)
      if (res) {
        this.index = parseInt(res);
      } else {
        this.index = 1;
      }
    });
  }

  getAreasTemas(id: string) {
    this.items = this.matchService.getAreaTemas(id);
    this.areas_subs1 = this.items.subscribe((res: any) => {
      this.areaSegment = res.area[0].titulo[this.index];
      this.fist_segment = this.areaSegment;
      this.first_area_array = res;
      this.change.detectChanges();
    })
  }

  getAreasTemas1(id: string) {
    if (id != '0') {
      this.items1 = this.matchService.getAreaTemas(id);
      this.areas_subs2 = this.items1.subscribe((res: any) => {
        this.second_area_array = res;
        this.second_segment = res.area[0].titulo[this.index];
        this.change.detectChanges();
      })
    }
  }

  setSubAreas(value: number, index: number, arreglo: string) {
    if (arreglo == 'f') {
      if (this.array_selected.length == 2) {
        if (!this.array_selected.includes(index)) {
          let u = this.array_selected[0];
          this.array_selected.splice(0, 1);
          this.first_area_array.temas[u].selected = 0;
          this.first_area_array.temas[index].selected = value;
          this.array_selected.push(index);
        } else {
          let r = this.array_selected.indexOf(index);
          this.array_selected.splice(r, 1);
          this.first_area_array.temas[index].selected = 0;
        }
      } else {
        if (!this.array_selected.includes(index)) {
          this.array_selected.push(index);
          this.first_area_array.temas[index].selected = value;
        } else {
          let r = this.array_selected.indexOf(index);
          this.array_selected.splice(r, 1);
          this.first_area_array.temas[index].selected = 0;
        }
      }
    } else {
      if (this.array_selected1.length == 2) {
        if (!this.array_selected1.includes(index)) {
          let u = this.array_selected1[0];
          this.array_selected1.splice(0, 1);
          this.second_area_array.temas[u].selected = 0;
          this.second_area_array.temas[index].selected = value;
          this.array_selected1.push(index);
        } else {
          let r = this.array_selected1.indexOf(index);
          this.array_selected1.splice(r, 1);
          this.second_area_array.temas[index].selected = 0;
        }
      } else {
        if (!this.array_selected1.includes(index)) {
          this.array_selected1.push(index);
          this.second_area_array.temas[index].selected = value;
        } else {
          let r = this.array_selected1.indexOf(index);
          this.array_selected1.splice(r, 1);
          this.second_area_array.temas[index].selected = 0;
        }
      }
    }
    this.change.detectChanges();
  }

  async presentModal(item: any) {
    const modal = await this.modalController.create({
      component: DescriptionSelectionPage, swipeToClose: true,
      componentProps: {
        item,
        index: this.index
      }
    });

    await modal.present();

  }

  nextStep() {
    let obj = [];
    let obj1 = [];

    obj.push(this.first_area_array.temas[this.array_selected[0]])
    if (this.array_selected.length == 2) {
      obj.push(this.first_area_array.temas[this.array_selected[1]])
    }
    if (this.second_area_array) {
      obj1.push(this.second_area_array.temas[this.array_selected1[0]])
      if (this.array_selected1.length == 2) {
        obj1.push(this.second_area_array.temas[this.array_selected1[1]])
      }
    }

    this.presentModal1(obj, obj1);
  }

  async presentModal1(obj: any, obj1: any) {
    const modal = await this.modalController.create({
      component: AreaOptionsSelectedModalPage, swipeToClose: true,
      componentProps: {
        obj,
        obj1,
        title: this.fist_segment,
        title1: this.second_segment,
        i: this.index,
        first_area: this.fistArea,
        second_area: this.secondArea
      }
    });

    await modal.present();

  }

  regresar() {
    this.navController.navigateRoot('/need-help')
  }


}