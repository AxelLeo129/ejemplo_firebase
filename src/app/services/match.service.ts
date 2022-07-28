import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  pruebaVariable: any;

  constructor(private database: AngularFirestore, private translate: TranslateService) { }

  getCollectionWhere(collection: string, tipo: string, where: string) : Observable<any[]> {
    let dbRef = this.database.collection(collection, query => query.where(where, '==', tipo));
    return dbRef.snapshotChanges().pipe(map(items => {
      return items.map((item: any) => {
        const data = item.payload.doc.data();
        const id = item.payload.doc.id;
        const ej: any = data;
        ej.id = id;
        return ej;
      })
    }));
  }

  getAreaTemas(id) : Observable<any> {
    let temas = [];
    return this.pruebaVariable = combineLatest(
      this.database.collection('motivos_consulta').doc(id).valueChanges(),
      this.database.collection('motivos_consulta').doc(id).collection('temas', query => query.orderBy('value', 'asc')).snapshotChanges().pipe(map(element => {
        element.map((e: any) => {
          let data = e.payload.doc.data();
          let id = e.payload.doc.id;
          let obj: any = data;
          obj.id = id;
          temas.push(obj);
        })
      }))
    ).pipe(map((area) => {
      let datos = {area, temas};
      return datos;
    }));
  }

  getTherapists() : Observable<any[]> {
    let dbRef = this.database.collection('terapeutas');
    return dbRef.snapshotChanges().pipe(map(items => {
      return items.map((item: any) => {
        let dias_array = [];
        const data: any = item.payload.doc.data();
        if(data.dias_atencion){
          data.dias_atencion.forEach(element => {
            if(element == 0){
              element = this.translate.instant('MATCHRESULTS.Sunday')
            } else if (element == 1){
              element = this.translate.instant('MATCHRESULTS.Monday')
            } else if (element == 2){
              element = this.translate.instant('MATCHRESULTS.Tuesday')
            } else if (element == 3){
              element = this.translate.instant('MATCHRESULTS.Wednesday')
            } else if (element == 4){
              element = this.translate.instant('MATCHRESULTS.Thursday')
            } else if (element == 5){
              element = this.translate.instant('MATCHRESULTS.Friday')
            } else if (element == 6){
              element = this.translate.instant('MATCHRESULTS.Saturday')
            }
            dias_array.push(element);
          });
        }
        const id = item.payload.doc.id;
        const ej: any = data;
        ej.uid = id;
        ej.dias_array = dias_array;
        return ej;
      })
    }));
  }

}
