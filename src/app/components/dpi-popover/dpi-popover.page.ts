import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-dpi-popover',
  templateUrl: './dpi-popover.page.html',
  styleUrls: ['./dpi-popover.page.scss'],
})
export class DpiPopoverPage implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  close(){
    this.popoverController.dismiss();
  }

}
