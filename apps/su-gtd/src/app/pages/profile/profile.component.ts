import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@su-gtd/api-interfaces';
import { AuthService } from '../../@core/auth/service/auth.service';

@Component({
  selector: 'su-gtd-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  isEditable = false;
  currentUser: User;
  fullName = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.user;
    this.fullName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    this.form = this.formBuilder.group(
      {
        firstName: [this.currentUser.firstName, Validators.required],
        lastName: [this.currentUser.lastName, Validators.required],
        email: [
          this.currentUser.email,
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^[^\s@]+@su\.edu\.ph$/),
          ],
        ],
        birthday: [this.currentUser.birthday, Validators.required],
        gender: [this.currentUser.gender, Validators.required],
      },
      Validators.required
    );
    this.form.disable();
  }

  setEditMode() {
    this.isEditable = !this.isEditable;

    if (!this.isEditable) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
}
