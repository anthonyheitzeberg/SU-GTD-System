import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AnnualReportConfirmationDialogComponent } from './dialogs/annual-report-confirmation-dialog/annual-report-confirmation-dialog.component';
import { Colleges, GuidanceServices } from '@su-gtd/api-enums';

@Component({
  selector: 'su-gtd-annual-report',
  templateUrl: './annual-report.component.html',
})
export class AnnualReportComponent implements OnInit {
  years: number[] = [];
  colleges = Colleges;
  guidanceServices = GuidanceServices;

  constructor(private dialogService: NbDialogService) {}

  ngOnInit(): void {
    this.generateYearSelection();
  }

  openConfirmDialog() {
    this.dialogService.open(AnnualReportConfirmationDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
    });
  }

  generateYearSelection(startYear = 1901) {
    let endDate = new Date().getFullYear();
    for (let i = endDate; i >= startYear; i--) {
      this.years.push(endDate);
      endDate--;
    }
  }
}
