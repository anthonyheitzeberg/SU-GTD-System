import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbInputModule,
  NbSelectModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NbCheckboxModule,
    NbAlertModule,
    NbButtonModule,
    NbDatepickerModule,
    NbInputModule,
    NbFormFieldModule,
    NbSelectModule,
  ],
})
export class AuthModule {}
