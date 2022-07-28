import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  pattern: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private authService: AuthService, private translate: TranslateService, private loadingController: LoadingController) {
    this.loginForm = this.createFormGroup();
  }

  ngOnInit() {

  }

  createFormGroup() {
    return new FormGroup({
      'correo': new FormControl('', [Validators.required, Validators.pattern(this.pattern)]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  login() {
    localStorage.clear();
    this.authService.loginWithEmail(this.loginForm.value.correo, this.loginForm.value.password);
  }

  get correo() { return this.loginForm.get('correo'); }
  get password() { return this.loginForm.get('password'); }

}
