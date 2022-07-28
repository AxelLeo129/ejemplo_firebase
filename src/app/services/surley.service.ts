import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SurleyService {

  constructor(private database: AngularFirestore) { }


  getEncuesta(id: string) : Promise<any> {
    let dbRef = this.database.collection('ejercicios').doc(id).get();
    return dbRef.toPromise();
  }

  getEncuesta_respuestas(id: string) : Promise<any> {
    let dbRef = this.database.collection('resultados_ejercicios').doc(id).get();
    return dbRef.toPromise();
  }

  getPreguntas(id: string) :Promise<any> {
    let dbRef = this.database.collection('ejercicios').doc(id).collection('preguntas', query => query.orderBy('orden')).get();
    return dbRef.toPromise();
  }

  getRespuestas(id: string, id1: string){
    let dbRef = this.database.collection('ejercicios').doc(id).collection('preguntas').doc(id1).collection('respuestas').get();
    return dbRef.toPromise(); 
  }

  saveRespuesta(obj:any){
    let dbRef = this.database.collection('resultados_ejercicios').doc(obj.ejercicio + obj.usuario);
    return dbRef.set(obj);
  }

}
