import { NgChartsModule } from 'ng2-charts';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { MatTableModule } from '@angular/material/table';
import { BarChartComponent } from './statistics/components/bar-chart/bar-chart.component';
import { CalculatePercentageDirective } from './annual-report/calculate-percentage.directive';
@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
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
    NgChartsModule,
    MatTableModule,
  ],
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProfileComponent,
    AnnualReportComponent,
    StatisticsComponent,
    LogoutComponent,
    AnnualReportConfirmationDialogComponent,
    BarChartComponent,
    CalculatePercentageDirective,
  ],
})
export class PagesModule {}
