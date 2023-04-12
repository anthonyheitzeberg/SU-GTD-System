import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { StatisticsComponent } from './statistics/statistics.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbMenuModule,
  NbRadioModule,
  NbSelectModule,
  NbTabsetModule,
  NbTagModule,
  NbTooltipModule,
  NbTreeGridModule,
  NbUserModule,
} from '@nebular/theme';
import { AnnualReportComponent } from './annual-report/annual-report.component';
import { ProfileComponent } from './profile/profile.component';
import { AnnualReportConfirmationDialogComponent } from './annual-report/dialogs/annual-report-confirmation-dialog/annual-report-confirmation-dialog.component';
@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbIconModule,
    NbCardModule,
    NbButtonModule,
    NbFormFieldModule,
    NbSelectModule,
    NbInputModule,
    NbDatepickerModule,
    NbRadioModule,
    NbTreeGridModule,
    NbTagModule,
    NbTabsetModule,
    NbUserModule,
    NbTooltipModule,
  ],
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProfileComponent,
    AnnualReportComponent,
    StatisticsComponent,
    AnnualReportConfirmationDialogComponent,
  ],
})
export class PagesModule {}
