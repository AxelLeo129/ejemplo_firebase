import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionnarieService {

  pruebaVariable: any;

  constructor(private database: AngularFirestore, private translate: TranslateService) { }

  getQuestionnarieQuestions(id) : Observable<any> {
    return this.pruebaVariable = combineLatest(
      this.database.collection('cuestionarios').doc(id).valueChanges(),
      this.database.collection('cuestionarios').doc(id).collection('preguntas', query => query.orderBy('orden', 'asc')).valueChanges()
    ).pipe(map(([questionnarie, questions]) => {
      let datos = {questionnarie, questions};
      return datos;
    }));
  }

}
