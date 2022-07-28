import {
  Injectable
} from '@angular/core';
import {
  AngularFireAuth
} from "@angular/fire/auth";
import {
  Router
} from '@angular/router';
import {
  UtilitiesService
} from './utilities.service';


import * as firebase from 'firebase/app';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  Usuario
} from "./../interfaces/usuario";
import {
  DataService
} from './data.service';
import {
  AngularFireDatabase
} from "@angular/fire/database";
import {
  GeoService
} from './geo';
import {
  NavController, Platform
} from '@ionic/angular';
import {
  Device
} from '@ionic-native/device/ngx';
import { FileService } from './file.service';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { map, first } from 'rxjs/operators';

declare var cordova: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isApp: boolean;
  currentCredential: firebase.auth.AuthCredential
  constructor(
    public auth: AngularFireAuth,
    public router: Router,
    public uti: UtilitiesService,
    private fileService: FileService,
    private data: DataService,
    public dbF: AngularFirestore,
    public dbR: AngularFireDatabase,
    private geo: GeoService,
    private nav: NavController,
    private platform: Platform,
    private translate: TranslateService,
    private device: Device
  ) {
    this.isApp = (0 === document.URL.indexOf("http://localhost") || 0 === document.URL.indexOf("ionic") || 0 ===
      document.URL.indexOf("https://localhost")) && -1 ===
      document.getElementsByTagName("html")[0].className.indexOf("plt-desktop")
  }

  async loginWithEmail(email: string, password: string, doNotRedirect?: boolean) {
    this.uti.createLoading(this.translate.instant('LOADING.msg'));
    if (typeof doNotRedirect === "undefined" || doNotRedirect === null) doNotRedirect = false;
    try {
      await this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    } catch (error) {
      //console.log(error)
    }

    this.auth.signInWithEmailAndPassword(email, password).then(async s => {
      this.checkProfile(s.user, doNotRedirect)
    }).catch(e => {
      this.uti.dissmissLoading();
      this.uti.errorAuth(e)
    })
  }


  /*completeLogin(userUID: string, doNotRedirect: boolean) {
  if (!userUID) userUID = this.auth.currentUser ? this.auth.currentUser.uid : ""
  if (!userUID) return;
  this.checkProfile(this.auth.currentUser, doNotRedirect)
  }*/

  completeLoginS(userData: any, userUID: string) {

    localStorage.persistData('user', {
      data: userData,
      key: userUID
    }); // persists user in local storage
    this.redirecToLink();
  }

  checkProfile(user: firebase.User, doNotRedirect: boolean, notInitial?: boolean, masPropiedades?: boolean): Promise<{
    completo: boolean,
    tipo: number
  }> {
    return new Promise(async (res, rej) => {
      let userSnap = await this.dbF.collection("usuarios").doc(user.uid).get().toPromise(),
        userData: Usuario = userSnap.data() as Usuario;
      //console.log(user.email, userSnap.exists)
      if (!userSnap.exists && !doNotRedirect) {
        this.redirecToLink("signup");
        return res({
          completo: false,
          tipo: 1
        })
      }
      if (userData) {
        let o: Usuario = {};

        o.sistema = this.device.platform || ""
        o.marca = this.device.manufacturer || ""
        o.dispositivo = this.device.model || ""
        o.version = this.device.version || ""

        this.dbF.collection("usuarios").doc(user.uid).update(o)
        
        let completo = !masPropiedades ? this.checkearPropiedades(userData) : this.checkearMasPropiedades(userData)
        //console.log("USUARIO COMPLETO", completo)
        console.log("USUARIO COMPLETO")
        console.log("USUARIO COMPLETO")
        console.log("USUARIO COMPLETO")
        if (completo && !notInitial && !doNotRedirect)
          this.redirecToLink()
        if (!notInitial) {
        } else if (!masPropiedades && !completo && !doNotRedirect) this.redirecToLink("signup")
        res({
          completo: completo,
          tipo: 1
        })
      } else {
        if (!doNotRedirect)
          this.redirecToLink("signup")
        res({
          completo: false,
          tipo: 1
        })
      }
    })
  }

  checkearPropiedades(data: Usuario): boolean {
    let propiedades = [
      "correo",
      //"fecha_nacimiento"
    ]
    let dejar = true
    propiedades.forEach(prop => {
      if (!data[prop]) dejar = false
    });
    return dejar
  }
  checkearMasPropiedades(data: Usuario): boolean {
    let propiedades = [
      "correo",
      //"nombre",
      //"fecha_nacimiento",
      //"telefono"
    ]
    let dejar = true
    //console.log(data);
    propiedades.forEach(prop => {
      if (!data[prop]) dejar = false
    });
    return dejar
  }
  redirecToLink(route?: string) {
    this.uti.dissmissLoading();
    this.nav.navigateRoot(route || "/home", {
      animated: false
    })
  }
  logOut() {
    this.auth.signOut();
  }

  storeUser(email: string, userId: string, name: string = "") {
    let fecha = new Date().getTime();
    this.dbF.collection('usuarios').doc(userId).set({
      free_trial: true,
      id: userId,
      nombre: name,
      correo: email,
      fecha_creacion: fecha
    });
    return this.dbF.collection('regalos').doc(userId).set({
      regalado: false
    });
  }

  createUserWithEmailAndPassword(email: string, password: string, name: string) {
    this.uti.createLoading(this.translate.instant('LOADING.msg'));
    this.auth.createUserWithEmailAndPassword(email, password).then(user => {
      this.storeUser(email, user.user.uid, name).then(() => {
        this.redirecToLink();
        this.uti.dissmissLoading();
      }).catch((err: any) => {
        console.log(err);
        this.uti.dissmissLoading();
      });
    }).catch(err => {
      console.log(err);
      this.uti.presentAlert('Error', err.message);
      this.uti.dissmissLoading();
    })
  }

  resetPassword(email: string) {
    this.auth.sendPasswordResetEmail(email).then(() => {
      this.uti.presentAlertConfirm('', this.translate.instant('RECOVERYACCOUNT.Success'));
    }).catch(() => {
      this.uti.presentAlert('Error', this.translate.instant('RECOVERYACCOUNT.Error'));
    })
  }

  getCurrentUserPromise(): Promise<any> {
    return this.auth.authState.pipe(first()).toPromise();
  }

  getCurrentUser(): Observable<any> {
    return this.auth.authState;
  }

  getUserPromiseDB(uid: string) : Promise<any> {
    let dbRef = this.dbF.collection('usuarios').doc(uid).get();
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

  getCurrentUserDB(uid: string): Observable<any> {
    let db = this.dbF.collection('usuarios').doc(uid)
    return db.snapshotChanges().pipe(map((item: any) => {
      let data = item.payload.data();
      const id = item.payload.id;
      let ej: any = data;
      ej.id = id;
      return ej;
    }));
  }

  updateUser(id: string, obj: any) {
    return this.dbF.collection('usuarios').doc(id).update(obj);
  }

}