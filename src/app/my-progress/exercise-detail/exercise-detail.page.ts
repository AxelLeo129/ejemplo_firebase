import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurleyService } from 'src/app/services/surley.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.page.html',
  styleUrls: ['./exercise-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseDetailPage implements OnInit {

  id: string;
  data_res: any;
  index: number;
  questions: any[] = [];

  constructor(private route: ActivatedRoute, private surleyService: SurleyService, private change: ChangeDetectorRef, private languageService: LanguageService) { 
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {
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

  getQuestions(id: string){
    this.surleyService.getPreguntas(id).then((res: any) => {
      res.forEach(element => {
        let data = element.data();
        data.id = element.id;
        this.questions.push(data);
      });
      this.change.detectChanges();
    })
  }

  getData(id: string){
    this.surleyService.getEncuesta_respuestas(id).then((res: any) => {
      let id = res.id;
      let data = res.data();
      this.data_res = data;
      this.data_res.id = id;
      this.getQuestions(this.data_res.ejercicio);
      this.change.detectChanges();
    }).catch(err => console.log(err))
  }

}
