import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilitiesService } from './utilities.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(private database: AngularFirestore, private utilitiesService: UtilitiesService, private translate: TranslateService) { }
  getMoods(uid: string): Observable<any[]> {
    let dbRef = this.database.collection('moods', query => query.orderBy("fecha_creacion", "desc").where('uid', '==', uid))
    return dbRef.snapshotChanges().pipe(map(items => {
      return items.map((item: any) => {
        let temp: any = item.payload.doc.data();
        let fecha = temp.fecha_creacion.toDate();
        let a = fecha;
        let id = item.payload.doc.id;
        let ej: any = temp;
        ej.id = id;
        ej.fecha_creacion = a;
        return ej;
      })
    }));
  }

  getGoals(uid: string): Observable<any[]> {
    let dbRef = this.database.collection('metas',
      query => query.orderBy("fecha_cumplimiento", "asc").where('usuario', '==', uid))
    return dbRef.snapshotChanges().pipe(map(items => {
      return items.map((item: any) => {
        let temp: any = item.payload.doc.data();
        let fo = temp.fecha_cumplimiento;
        let fecha: Date = temp.fecha_cumplimiento.toDate() as Date;
        let a = fecha;
        let fo1 = temp.fecha_creacion;
        let fecha1 = temp.fecha_creacion.toDate();
        let a1 = fecha1;
        let id = item.payload.doc.id;
        let ej: any = temp;
        ej.id = id;
        ej.fecha_cumplimiento1 = fo;
        ej.fecha_creacion1 = fo1;
        ej.fecha_cumplimiento = a;
        ej.fecha_creacion = a1;
        return ej;
      })
    }));
  }

  saveGoal(obj: any) {
    //this.utilitiesService.createLoading(this.translate.instant('LOADING.msg'));
    let dbRef = this.database.collection('metas');
    dbRef.add(obj).then(() => {
      //this.utilitiesService.dissmissLoading();
      this.utilitiesService.presentToast(2000, this.translate.instant('GENERALSERVICE.Ok_toast_message'));
    }).catch(err => {
      //this.utilitiesService.dissmissLoading();
      this.utilitiesService.presentToast(2000, this.translate.instant(err))
    });
  }

  updateGoal(obj: any) {
    //this.utilitiesService.createLoading(this.translate.instant('LOADING.msg'));
    let dbRef = this.database.collection('metas');
    dbRef.doc(obj.id).update(obj).then(() => {
      //this.utilitiesService.dissmissLoading();
      this.utilitiesService.presentToast(2000, this.translate.instant('GENERALSERVICE.Update_toast_message'));
    }).catch(err => {
      //this.utilitiesService.dissmissLoading();
      this.utilitiesService.presentToast(2000, this.translate.instant(err))
    })
  }

  deleteGoal(id: string) {
    //this.utilitiesService.createLoading(this.translate.instant('LOADING.msg'));
    let dbRef = this.database.collection('metas');
    dbRef.doc(id).delete().then(() => {
      //this.utilitiesService.dissmissLoading();
      this.utilitiesService.presentToast(2000, this.translate.instant('GENERALSERVICE.Delete_toast_message'));
    }).catch(err => {
      //this.utilitiesService.dissmissLoading();
      this.utilitiesService.presentToast(2000, this.translate.instant(err))
    })
  }

  getExerciseResults(id: string): Observable<any[]> {
    let dbRef = this.database.collection('resultados_ejercicios', query => query.where('usuario', '==', id))
    return dbRef.snapshotChanges().pipe(map(items => {
      return items.map((item: any) => {
        let temp: any = item.payload.doc.data();
        let id = item.payload.doc.id;
        let ej: any = temp;
        ej.id = id;
        return ej;
      })
    }));
  }

}
