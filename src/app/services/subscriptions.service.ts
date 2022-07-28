import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {


  constructor(private database: AngularFirestore) { }


  getSubscriptions(verify: boolean) : Promise<any> {
    let items = [];
    let subscroptions_observable = this.database.collection('planes', query => query.where('tipo', 'in', ['regalo', 'general'])).get(); 
    if(!verify){
      subscroptions_observable = this.database.collection('planes', query => query.where('tipo', '==', 'general')).get();
    }
    return subscroptions_observable.toPromise().then((res: any) => {
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

  getSubscription(id: string){
    let dbRef = this.database.collection('planes').doc(id);
    return dbRef.snapshotChanges().pipe(map((item: any) => {
      let data = item.payload.data();
      const id = item.payload.id;
      let ej: any = data;
      ej.id = id;
      return ej;
    }));
  }

  getCard(id: string){
    let dbRef = this.database.collection('tarjetas').doc(id);
    return dbRef.snapshotChanges().pipe(map((item: any) => {
      let data = item.payload.data();
      const id = item.payload.id;
      let ej: any = data;
      ej.id = id;
      return ej;
    }));
  }

  getCards(){
    let dbRef = this.database.collection('tarjetas');
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

}
