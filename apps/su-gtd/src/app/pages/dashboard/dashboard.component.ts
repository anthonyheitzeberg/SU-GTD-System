import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../@core/auth/service/auth.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.user;
  }
}
