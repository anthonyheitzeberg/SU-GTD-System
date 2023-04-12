import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../@core/auth/service/auth.service';
import {
  NB_AUTH_OPTIONS,
  NbAuthService,
  NbLoginComponent,
} from '@nebular/auth';

@Component({
  selector: 'su-gtd-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends NbLoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS)
    options: Record<string, unknown>,
    cd: ChangeDetectorRef,
    router: Router,
    private authService: AuthService
  ) {
    super(service, options, cd, router);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^\s@]+@su\.edu\.ph$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(32),
        ],
      ],
    });
  }

  override login() {
    this.authService
      .login({
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
      })
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.router.navigate(['/']);
      });
  }
}
