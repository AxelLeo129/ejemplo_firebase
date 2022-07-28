import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { LanguageService } from 'src/app/services/language.service';
import { ModalController } from '@ionic/angular';
import { VideoModalPage } from 'src/app/components/video-modal/video-modal.page';
import { Subscription } from 'rxjs';
import { trigger, transition, query, stagger, animateChild, style, animate } from '@angular/animations';

@Component({
  selector: 'app-library-list',
  templateUrl: './library-list.page.html',
  styleUrls: ['./library-list.page.scss'],
  animations: [
    // nice stagger effect when showing existing elements
    trigger('list', [
      transition(':enter', [
        // child animation selector + stagger
        query('@items',
          stagger(200, animateChild()), { optional: true }
        )
      ]),
    ]),
    trigger('items', [
      // cubic-bezier for a tiny bouncing feel
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('0.5s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('0.5s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(0.5)', opacity: 0, height: '0px', margin: '0px' }))
      ]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryListPage implements OnInit {

  public index: number;
  id: string;
  cards: any[] = [];
  load: boolean = false;
  cards_subcription: Subscription;

  constructor(private modalController: ModalController, private route: ActivatedRoute, private generalService: GeneralService, private router: Router, private change: ChangeDetectorRef, private languageService: LanguageService) {
    this.languageService.getType().then(res => {
      if (res) {
        this.index = parseInt(res);
      } else {
        this.index = 0;
      }
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getData(this.id);
  }

  ionViewWillLeave(){
    if(this.cards_subcription){
      this.cards_subcription.unsubscribe();
    }
  }

  getData(id: string) {
    let is = this.generalService.getCollectionWhere('notas', id);
    this.cards_subcription = is.subscribe(s => {
      this.cards = s;
      this.load = true;
      this.change.detectChanges();
    });
  }

  ruta(i) {
    if(i.tipo == 'H'){
      this.router.navigate(['/post/' + i.id + '/' + i.color + '/' + i.tipo]);
    } else {
      this.presentModal(i.cloudinary_video);
    }
  }

  //this.presentModal(i.url_video);

  async presentModal(url_video: string) {
    const modal = await this.modalController.create({
      component: VideoModalPage, swipeToClose: true,
      componentProps: { url_video, id: this.id }
    });

    await modal.present();

  }

}
