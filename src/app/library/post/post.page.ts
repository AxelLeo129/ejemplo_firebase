import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  GeneralService
} from './../../services/general.service';
import {
  Observable, Subscription
} from 'rxjs';
import { LanguageService } from './../../services/language.service';
import { ModalController } from '@ionic/angular';
import { VideoModalPage } from './../../components/video-modal/video-modal.page';
import { trigger, transition, query, stagger, animateChild, style, animate } from '@angular/animations';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
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
export class PostPage implements OnInit {

  public index: number;
  nota: any = {
    texto: '',
    descripcion: '',
    html: '',
    clase: '',
    video: ''
  };
  color: string;
  type: string;
  nota_doc: any;
  item_subscription: Subscription;

  constructor(private route: ActivatedRoute, private generalService: GeneralService, private change: ChangeDetectorRef, private languageService: LanguageService, private modalController: ModalController) { }

  ngOnInit() {
    this.getLanguage();
    let id = this.route.snapshot.params.id;
    this.color = this.route.snapshot.params.color;
    this.type = this.route.snapshot.params.type;
    this.getData(id);
    /*if (this.type == 'H') {
      this.getData(id);
    } else {
      this.getDoc(id);
    }*/
  }

  ionViewWillLeave(){
    if(this.item_subscription){
      this.item_subscription.unsubscribe();
    }
  }

  getLanguage() {
    this.languageService.getType().then(res => {
      if (res) {
        this.index = parseInt(res);
      } else {
        this.index = 0;
      }
    });
  }

  getDoc(id: string) {
    this.nota_doc = this.generalService.getDoc('notas', id);
    this.nota_doc.subscribe(res => {
      console.log(res)
      this.nota.texto = res.texto;
      this.nota.clase = 'exercise-' + this.color;
      this.nota.descripcion = res.descripcion;
      this.nota.video = res.url_video;

      this.change.detectChanges();
      this.video();
    });
  }

  getData(id) {
    let item = this.generalService.getNotaHtml(id);
    this.item_subscription = item.subscribe(res => {
      this.nota.texto = res.notas.texto;
      this.nota.clase = 'exercise-' + this.color;
      this.nota.descripcion = res.notas.descripcion;
      this.nota.html = res.notas_html.html;
      this.change.detectChanges();
    })
  }

  video() {
    this.presentModal(this.nota.video);
  }

  async presentModal(url_video: string) {
    const modal = await this.modalController.create({
      component: VideoModalPage, swipeToClose: true,
      componentProps: { url_video }
    });

    await modal.present();

  }

}