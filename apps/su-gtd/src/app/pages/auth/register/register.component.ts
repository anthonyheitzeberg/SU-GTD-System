import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  NB_AUTH_OPTIONS,
  NbAuthService,
  NbRegisterComponent,
} from '@nebular/auth';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'su-gtd-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends NbRegisterComponent implements OnInit {
  form: FormGroup;
  selectedGender = '';
  index = 0;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS)
    options: Record<string, unknown>,
    cd: ChangeDetectorRef,
    router: Router
  ) {
    super(service, options, cd, router);
  }

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
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
        birthday: ['', Validators.required],
        gender: ['', Validators.required],
      },
      Validators.required
    );
  }

  showToast(status: NbComponentStatus = 'basic', message: string) {
    this.toastrService.show(message, `Toast: ${++this.index}`, { status });
  }

  override register(): void {
    console.log(this.form.value);
    const dateStr = this.form.controls.birthday.value;
    const dateObj = new Date(dateStr);
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObj.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);
    // if (this.showMessages.error && this.errors?.length && !this.submitted) {
    //   this.showToast('danger', this.showMessages);
    //   return;
    // }
  }
}
