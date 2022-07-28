import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-area-options-selected-modal',
  templateUrl: './area-options-selected-modal.page.html',
  styleUrls: ['./area-options-selected-modal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaOptionsSelectedModalPage implements OnInit {

  @Input() obj;
  @Input() obj1;
  @Input() title;
  @Input() title1;
  @Input() i;
  @Input() first_area;
  @Input() second_area;

  fist_array: any;
  second_array: any;
  titulo: string;
  titulo1: string;
  index: number;
  changeAreas: any;

  constructor(private modalController: ModalController,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private change: ChangeDetectorRef, private navController: NavController) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.fist_array = this.obj;
    this.second_array = this.obj1;
    this.titulo = this.title;
    this.titulo1 = this.title1;
    this.index = this.i;
    this.change.detectChanges();
  }

  cancel() {
    this.modalController.dismiss();
  }

  async next() {
    let changeAreas = localStorage.getItem("changeAreas")

    let areas: any = {
      area1: this.first_area,
      temas1: this.obj,
      areas2: this.second_area,
      temas2: this.obj1
    }
    localStorage.setItem('areas', JSON.stringify(areas));
    if (changeAreas === "s") {
      let temas_ids = [];
      areas.temas1.forEach(element => {
        temas_ids.push(element.id);
      });
      areas.temas2.forEach(element => {
        temas_ids.push(element.id);
      });
      let uid = (await this.auth.currentUser).uid,
        userSnap = await this.db.collection("usuarios").doc(uid).get().toPromise(),
        userData = userSnap.data();
      let dbRef = this.db.collection('conversaciones');
      dbRef.doc(uid + userData.terapeuta).update({ temas: temas_ids });
      localStorage.removeItem("changeAreas")
      this.navController.navigateRoot('/profile');
    } else {
      this.navController.navigateRoot('/lets-match');
    }
    this.modalController.dismiss();
  }

}
