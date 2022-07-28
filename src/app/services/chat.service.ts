import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilitiesService } from './utilities.service';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private database: AngularFirestore, private utilitiesService: UtilitiesService, private translate: TranslateService) { }


  getInitalData(id: string){
    let idf = id + 'QrJB0D40axeRzffutKn15cVOql42';
    let dbRef = this.database.collection('conversaciones').doc(idf).collection('mensajes');
    return dbRef.snapshotChanges().pipe(map((items: any) => {
      return items.map(item => {
        const data = item.payload.doc.data();
        const id = item.payload.doc.id;
        const ej: any = data;
        ej.id = id;
        return ej;
      })
    }));
  }

  getScrollData(id: string, doc: string){
    let idf = id + 'QrJB0D40axeRzffutKn15cVOql42';
    let dbRef = this.database.collection('conversaciones').doc(idf).collection('mensajes', query => query.orderBy("fecha_creacion", "asc").startAt(doc));
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

  setMessage(obj: any, id: string) {
    let idf = id + 'QrJB0D40axeRzffutKn15cVOql42';
    let dbRef = this.database.collection('conversaciones').doc(idf).collection('mensajes');
    dbRef.add(obj).then(() => {
      //this.utilitiesService.presentAlertConfirm('Exitosamente', 'Operación realizada exitosamente');
    }).catch(err => {
      this.utilitiesService.presentAlert('Error', err.message);
    });
  }

  getTherapist(id: string){
    let db = this.database.collection('terapeutas').doc(id)
    return db.snapshotChanges().pipe(map((item: any) => {
      let data: any = item.payload.data();
      const id = item.payload.id;
      console.log(id);
      let ej: any = data;
      ej.id = id;
      return ej;
    })); 
  }

  getTherapistPromise(id: string){
    let dbRef = this.database.collection('terapeutas').doc(id).get();
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

}
