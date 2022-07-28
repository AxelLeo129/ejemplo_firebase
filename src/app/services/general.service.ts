import {
  Injectable
} from '@angular/core';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  UtilitiesService
} from './utilities.service';
import {
  Observable, combineLatest
} from 'rxjs';
import {
  map
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { BioModalPage } from '../components/bio-modal/bio-modal.page';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  items: Observable<any[]>;
  pruebaVariable: any;

  constructor(private database: AngularFirestore, private utilitiesService: UtilitiesService, private translate: TranslateService, private modalController: ModalController) { }

  setSubCollection(id: string, collection: string, subcollection: string, obj: any) {
    let dbRef = this.database.collection(collection).doc(id).collection(subcollection);
    dbRef.add(obj).then(() => {
      this.utilitiesService.presentAlertConfirm('Exitosamente', 'Operación realizada exitosamente');
    }).catch(err => {
      this.utilitiesService.presentAlert('Error', err.message);
    });
  }

  getDocPromise1(collection: string, id: string): Promise<any> {
    let dbRef = this.database.collection(collection).doc(id).get();
    return dbRef.toPromise().then((item: any) => {
      let data = item.data();
      if (data == undefined) {
        return false;
      }
      let id = item.id;
      let ej: any = data;
      ej.id = id;
      return ej;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  updateDoc(collection: string, obj: any, id: string) {
    let update_db = this.database.collection(collection).doc(id).update(obj);
    return update_db;
  }

  deleteDoc(collection: string, id: string) {
    console.log(collection, id);
    let delete_db = this.database.collection(collection).doc(id).delete();
    return delete_db;
  }

  saveDoc(collection: string, obj: any) {
    let dbRef = this.database.collection(collection);
    dbRef.add(obj).then(() => {
      //this.utilitiesService.presentToast(2000, this.translate.instant('GENERALSERVICE.Ok_toast_message'));
      this.presentModal(obj.mood);
    }).catch(err => {
      this.utilitiesService.presentAlert('Error', err.message);
    });
  }

  saveDoc1(collection: string, obj: any) {
    let dbRef = this.database.collection(collection);
    return dbRef.add(obj)
  }

  saveDocWithoutAlert(collection: string, obj: any, id: string) {
    let dbRef = this.database.collection(collection);
    return dbRef.doc(id).set(obj);
  }

  saveChat(obj: any, id: string) {
    let dbRef = this.database.collection('conversaciones');
    return dbRef.doc(id).set(obj);
  }

  async presentModal(mood: number) {
    const modal = await this.modalController.create({
      component: BioModalPage,
      componentProps: {
        type: 'alerta',
        title: this.translate.instant('GENERALSERVICE.Ok_feeling_toast_message'),
        subTitle: this.translate.instant('GENERALSERVICE.Mood_subtitle'),
        img: 'assets/emociones/' + mood + '.svg'
      }, swipeToClose: true,
      cssClass: 'with-top'
    });

    await modal.present();

  }

  getCatalogo(collection: string) : Promise<any> {
    let items = [];
    let dbRef = this.database.collection(collection, query => query.orderBy('orden', 'asc')).get();
    //return dbRef.toPromise();
    return dbRef.toPromise().then((res: any) => {
      res.forEach((e: any) => {
        let data: any = e.data();
        const id = e.id;
        const ej: any = data;
        if (ej.tipo == 3) {
          ej.id = '/notas/' + ej.id;
        } else if (ej.tipo == 2) {
          ej.id = '/ejercicios/principales/' + ej.id;
        } else {
          ej.id = '/' + ej.id;
        }
        ej.id1 = id;
        items.push(ej);
      });
      return items;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  getCollectionWhere(collection: string, seccion: string): Observable<any[]> {
    let colores = ['1', '2', '3', '4', '5', '6'];
    let cont = 0;
    let dbRef = this.database.collection(collection, query => query.where('seccion', '==', seccion));
    return dbRef.snapshotChanges().pipe(map(items => {
      return items.map((item: any) => {
        const data = item.payload.doc.data();
        const id = item.payload.doc.id;
        const ej: any = data;
        ej.id = id;
        ej.clase = 'exercise-' + colores[cont];
        ej.color = colores[cont];
        if (cont == 5) {
          cont = 0;
        } else {
          cont = cont + 1;
        }
        return ej;
      })
    }));
  }

  getCollectionWhere1(collection: string, tipo: string, where: string): Observable<any[]> {
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

  getCollectionWhere1Promise(collection: string, where: string, tipo: any) : Promise<any> {
    let items = [];
    let dbRef = this.database.collection(collection, query => query.where(where, '==', tipo)).get();
    return dbRef.toPromise().then((res: any) => {
      res.forEach((e: any) => {
        let dato: any = e.data();
        dato.id = e.id;
        items.push(dato);
      });
      return items;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  getCollection(collection: string, order?: string, orderType?: 'desc' | 'asc'): Observable<any[]> {
    let dbRef = order && orderType ? this.database.collection(collection, q => q.orderBy(order, orderType))
      : this.database.collection(collection);
    return dbRef.snapshotChanges().pipe(map(items => {
      return items.map((item: any) => {
        const data = item.payload.doc.data();
        const id = item.payload.doc.id;
        const ej: any = data;
        ej.id1 = id;
        return ej;
      })
    }));
  }

  getCollectionPromise(collection: string, order?: any, orderType?: 'desc' | 'asc'){
    let items = [];
    let dbRef = order && orderType ? this.database.collection(collection, query => query.orderBy(order, orderType)).get() : this.database.collection(collection).get();
    //return dbRef.toPromise();
    return dbRef.toPromise().then((res: any) => {
      res.forEach((e: any) => {
        let data: any = e.data();
        const id = e.id;
        const ej: any = data;
        ej.id = id;
        items.push(ej);
      });
      return items;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  getExercises() : Promise<any> {
    let items = [];
    let dbRef = this.database.collection('ejercicios').get();
    //return dbRef.toPromise();
    return dbRef.toPromise().then((res: any) => {
      res.forEach((e: any) => {
        let dato: any = e.data();
        dato.id = e.id;
        const ej: any = dato;
        ej.tiempo = (ej.tiempo / 60000);
        ej.tiempo = Math.round(ej.tiempo);
        items.push(ej);
      });
      return items;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  getDoc(collection: string, id: string) {
    let dbRef = this.database.collection(collection).doc(id);
    return dbRef.snapshotChanges().pipe(map((item: any) => {
      let data = item.payload.data();
      if (data == undefined) {
        return false;
      }
      const id = item.payload.id;
      let ej: any = data;
      ej.id = id;
      return ej;
    }));
  }

  getDocPromise(collection: string, id: string) {
    let dbRef = this.database.collection(collection).doc(id).get();
    return dbRef.toPromise();
  }

  getDocPromiseAdvance(collection: string, id: string) : Promise<any> {
    let dbRef = this.database.collection(collection).doc(id).get();
    return dbRef.toPromise().then((item: any) => {
      let data = item.data();
      if (data == undefined) {
        return false;
      }
      let id = item.id;
      let ej: any = data;
      ej.id = id;
      return ej;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  getNotaHtml(id): Observable<any> {
    return this.pruebaVariable = combineLatest(
      this.database.collection('notas').doc(id).valueChanges(),
      this.database.collection('notas_html').doc(id).valueChanges()
    ).pipe(map(([notas, notas_html]) => {
      let datos = { notas, notas_html };
      return datos;
    }));
  }

  prueba() {

  }

}