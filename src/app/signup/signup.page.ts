import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  PopoverController,
  AlertController,
  ModalController,
  LoadingController
} from '@ionic/angular';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  LanguagePopoverPage
} from '../language-popover/language-popover.page';
import {
  AuthService
} from '../services/auth.service';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { TemsPoliciesModalPage } from '../components/tems-policies-modal/tems-policies-modal.page';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;
  pattern: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  id: string;
  public selected1 = '';
  public selected = '';

  createFormGroup() {
    return new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.pattern(this.pattern)]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'accept_terms': new FormControl(undefined, [Validators.required])
    });
  }

  constructor(private change: ChangeDetectorRef, private popoverController: PopoverController, private authService: AuthService, private modalController: ModalController) {
    this.signupForm = this.createFormGroup();
  }

  ngOnInit() { }

  async openLanguagePopover(ev) {
    const popover = await this.popoverController.create({
      component: LanguagePopoverPage,
      event: ev
    });
    await popover.present();
  }

  onResetForm() {
    this.signupForm.reset();
  }

  signUp() {
    if (this.signupForm.value.accept_terms == false || this.signupForm.value.accept_terms == undefined) {
      this.onResetForm();
    } else {
      this.authService.createUserWithEmailAndPassword(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name);
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: TemsPoliciesModalPage, 
      swipeToClose: true
    });

    await modal.present();

    const value = await modal.onDidDismiss();

    this.signupForm.controls['accept_terms'].setValue(value.data);

    this.change.detectChanges();
  }

  get name() {
    return this.signupForm.get('name');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }

  get accept_terms() {
    return this.signupForm.get('accept_terms');
  }

}