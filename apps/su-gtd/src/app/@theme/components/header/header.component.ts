import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';

import { Subject } from 'rxjs';
import { AuthService } from '../../../@core/auth/service/auth.service';
import { User } from '@su-gtd/api-interfaces';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly = false;
  user: User;
  fullName = '';

  currentTheme = 'default';

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.user = this.authService.user;
    this.fullName = `${this.user.firstName} ${this.user.lastName}`;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
