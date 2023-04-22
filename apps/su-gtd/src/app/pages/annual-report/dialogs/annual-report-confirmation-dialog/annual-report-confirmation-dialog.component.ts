import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'su-gtd-annual-report-confirmation-dialog',
  templateUrl: './annual-report-confirmation-dialog.component.html',
  styleUrls: ['./annual-report-confirmation-dialog.scss'],
})
export class AnnualReportConfirmationDialogComponent {
  @Input() title: string;

  constructor(
    protected ref: NbDialogRef<AnnualReportConfirmationDialogComponent>
  ) {}

  dismiss(confirm: boolean) {
    this.ref.close(confirm);
  }
}
