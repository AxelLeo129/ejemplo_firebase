import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatchService } from 'src/app/services/match.service';
import { Observable, Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';
import { NavController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-help-areas',
  templateUrl: './help-areas.page.html',
  styleUrls: ['./help-areas.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpAreasPage implements OnInit {

  index: number;
  optionSelected: string = '0';
  optionSelected1: string = '0';
  areasArray: any[] = []; 
  areas: any[] = [];

  constructor(private navController: NavController, private matchSevice: MatchService, private change: ChangeDetectorRef, private languageService: LanguageService, private generalService: GeneralService) { }

  ngOnInit() {
    this.getLanguage();
    this.getData();
  }

  setOption(id: string){
    if(this.optionSelected == '0'){
      this.optionSelected = id;
    } else if (this.optionSelected == id){
      this.optionSelected = this.optionSelected1;
      this.optionSelected1 = '0';
    } else if(this.optionSelected1 == '0'){
      this.optionSelected1 = id;
    } else if (this.optionSelected1 == id){
      this.optionSelected1 = '0';
    } else {
      this.optionSelected = this.optionSelected1;
      this.optionSelected1 = id;
    }
  }

  getLanguage(){
    this.languageService.getType().then(res => {
      if(res){
        this.index = parseInt(res);
      }else{
        this.index = 0;
      }
    });
  }

  getData(){ 
    this.generalService.getCollectionWhere1Promise('motivos_consulta', 'tipo', 'ayuda').then((res: any) => {
      this.areas = res;
      this.change.detectChanges();
    }).catch((err: any) => {
      console.log(err);
    });
  }

  nextPage(){
    if(this.optionSelected == this.optionSelected1){
      this.optionSelected1 = '0'
    }
    this.navController.navigateRoot('/selected-areas/' + this.optionSelected + '/' + this.optionSelected1);
  }

  regresar(){
    this.navController.navigateRoot('/need-help')
  }

}
