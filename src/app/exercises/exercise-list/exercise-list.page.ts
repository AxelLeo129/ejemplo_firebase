import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { trigger, transition, query, stagger, animateChild, style, animate } from '@angular/animations';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.page.html',
  styleUrls: ['./exercise-list.page.scss'],
  animations: [
    // nice stagger effect when showing existing elements
    trigger('list', [
      transition(':enter', [
        // child animation selector + stagger
        query('@items',
          stagger(200, animateChild()), { optional: true }
        )
      ]),
    ]),
    trigger('items', [
      // cubic-bezier for a tiny bouncing feel
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('0.5s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('0.5s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(0.5)', opacity: 0, height: '0px', margin: '0px' }))
      ]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseListPage implements OnInit {

  exercises : any[] = [];
  public index : number;

  constructor(private generalService: GeneralService, private change: ChangeDetectorRef, private router: Router, private languageService: LanguageService) {}

  ngOnInit() {
    this.getLanguage();
    this.getData();
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

  ruta(i){
    this.router.navigate(['exercise-slider/' + i.id]);
  }

  getData(){
    this.generalService.getExercises().then(res => {
        this.exercises = res;
        this.change.detectChanges();
    }).catch((err: any) => console.log(err));
  }

}
