import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pass-recovery',
  templateUrl: './pass-recovery.page.html',
  styleUrls: ['./pass-recovery.page.scss'],
})
export class PassRecoveryPage implements OnInit {

  public email: string;

  constructor(private authService: AuthService, private alertController: AlertController, private translate: TranslateService) { }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('ALERT.header'),
      message: this.translate.instant('ALERT.msg1'),
      buttons: ['OK']
    });
  
    await alert.present();
  }

  resetPassword(){
    if(this.email){
      this.authService.resetPassword(this.email);
    }else{
      this.presentAlert();
    } 
  }

}
