import {
  Component,
  OnInit,
  Input,
  HostListener
} from '@angular/core';
import {
  ModalController
} from '@ionic/angular';

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.page.html',
  styleUrls: ['./video-modal.page.scss'],
})
export class VideoModalPage implements OnInit {

  @Input() url_video;
  //@Input() id;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
  }

  cancel() {
    //this.router.navigate(['/notas/' + this.id]);
    this.modalController.dismiss();
  }

}