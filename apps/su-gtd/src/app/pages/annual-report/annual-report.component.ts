import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Colleges, GuidanceServices, TargetGroups } from '@su-gtd/api-enums';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { KeyValue } from '@angular/common';
import { AnnualFormService } from './annual-form.service';
import { AnnualFormActivity } from '@su-gtd/api-interfaces';
import { SubSink } from 'subsink';
import { AnnualReportConfirmationDialogComponent } from './dialogs/annual-report-confirmation-dialog/annual-report-confirmation-dialog.component';
import { of, switchMap } from 'rxjs';

interface IAnnualReportStatus {
  canAdd: boolean;
  canUpdate: boolean;
}
enum FormTypes {
  VIEW_REPORT = 'VIEW_REPORT',
  SUBMIT_UPDATE_REPORT = 'SUBMIT_UPDATE_REPORT',
}
@Component({
  selector: 'su-gtd-annual-report',
  templateUrl: './annual-report.component.html',
  styleUrls: ['./annual-report.component.scss'],
})
export class AnnualReportComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  viewReportForm: FormGroup;
  form!: FormGroup;

  displayedColumns: string[] = [
    'guidanceServiceType',
    'activityName',
    'dateOfActivity',
    'targetGroup',
    'performanceIndicator',
    'percentage',
  ];
  dataSource: AnnualFormActivity[] = [];
  spans = [];

  colleges = Colleges;
  formTypes = FormTypes;
  targetGroups = TargetGroups;
  guidanceServices = GuidanceServices;

  years: number[] = [];
  annualFormsActivities: AnnualFormActivity[] = [];
  filteredViewAnnualReports: AnnualFormActivity[] = [];

  isReportActionSelected = false;
  hasSelected = false;
  hasViewAnnualReportSubmitted = false;
  canUpdate = false;
  annualFormStatus: IAnnualReportStatus = {
    canAdd: false,
    canUpdate: false,
  };

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private annualFormService: AnnualFormService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.generateYearSelection();
    this.subs.sink = this.annualFormService
      .getAllActivities()
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.annualFormsActivities = res;
      });

    this.form = this.fb.group({
      college: ['', Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      guidanceServices: this.fb.array([], Validators.required),
    });

    this.viewReportForm = this.fb.group({
      college: ['', Validators.required],
      year: [new Date().getFullYear(), Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  generateYearSelection(startYear = 2013) {
    let endDate = new Date().getFullYear();
    for (let i = endDate; i >= startYear; i--) {
      this.years.push(endDate);
      endDate--;
    }
  }

  getActivitiesOfViewReports() {
    const college = this.viewReportForm.get('college').value;
    const year = this.viewReportForm.get('year').value;

    this.subs.sink = this.annualFormService
      .getAllActivitiesByCollegeAndYear(year, college)
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.filteredViewAnnualReports = res;
        this.dataSource = res;
        this.spans = [];
        this.cacheSpan('guidanceServiceType', (d) => d.guidanceServiceType);
        this.changeDetectorRef.detectChanges();
      });

    setTimeout(() => {
      this.hasSelected = true;
    }, 300);
    this.hasViewAnnualReportSubmitted = true;
  }

  add(guidanceService: KeyValue<string, GuidanceServices>) {
    const formGroup: FormGroup = this.fb.group({
      id: null,
      index: (this.form.controls.guidanceServices as FormArray).controls.length,
      guidanceServiceType: guidanceService.value,
      percentage: [
        {
          value: null,
          disabled: true,
        },
        Validators.required,
      ],
      activityName: [null, Validators.required],
      date: [null, Validators.required],
      targetGroup: TargetGroups.ALL_STUDENTS,
      numOfAttendees: [null, Validators.required],
      totalTargetGroup: [null, Validators.required],
    });
    (this.form.controls.guidanceServices as FormArray).push(formGroup);
  }

  clearForm(formType: FormTypes = FormTypes.SUBMIT_UPDATE_REPORT) {
    this.hasViewAnnualReportSubmitted = false;
    this.annualFormStatus = {
      canAdd: false,
      canUpdate: false,
    };
    switch (formType) {
      case FormTypes.VIEW_REPORT:
        this.filteredViewAnnualReports = [];

        this.viewReportForm = this.fb.group({
          college: ['', Validators.required],
          year: [new Date().getFullYear(), Validators.required],
        });
        break;
      case FormTypes.SUBMIT_UPDATE_REPORT:
      default:
        this.form.reset();
        this.form = this.fb.group({
          college: ['', Validators.required],
          year: [new Date().getFullYear(), Validators.required],
          guidanceServices: this.fb.array([], Validators.required),
        });
    }
  }

  remove(formGroup: FormGroup) {
    const id = formGroup.get('id').value ?? null;
    if (!id) {
      (this.form.get('guidanceServices') as FormArray).removeAt(
        formGroup.get('index').value
      );
      return;
    }

    const activityIndex = (
      this.form.get('guidanceServices') as FormArray
    ).value.findIndex((activity) => activity.id === id);

    (this.form.get('guidanceServices') as FormArray).removeAt(activityIndex);
  }

  getActivities(guidanceService: string) {
    const quidanceServiceEnum: GuidanceServices =
      GuidanceServices[guidanceService];
    if (!this.form.controls.guidanceServices.value) {
      return [];
    }

    return (this.form.get('guidanceServices') as FormArray).controls.filter(
      (control) =>
        control.get('guidanceServiceType').value === quidanceServiceEnum
    );
  }

  toFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  toFormArray(control: AbstractControl): FormArray {
    return control as FormArray;
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  cacheSpan(key, accessor) {
    for (let i = 0; i < this.dataSource.length; ) {
      const currentValue = accessor(this.dataSource[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.dataSource.length; j++) {
        if (currentValue != accessor(this.dataSource[j])) {
          break;
        }

        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
  }

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }

  check() {
    const { college, year } = this.form.value;
    this.annualFormService
      .getAllActivitiesByIdentifier({
        college,
        year,
      })
      .subscribe((res) => {
        if (!res || !res.length) {
          this.annualFormStatus = {
            canAdd: true,
            canUpdate: false,
          };
          return;
        }

        this.annualFormStatus = {
          canAdd: false,
          canUpdate: true,
        };

        this.updateForm(res);
      });
  }

  updateForm(activities: AnnualFormActivity[]) {
    this.clearFormArray(this.form.get('guidanceServices') as FormArray);
    for (const activity of activities) {
      (this.form.get('guidanceServices') as FormArray).push(
        this.fb.group({
          id: activity.id,
          guidanceServiceType: activity.guidanceServiceType,
          percentage: [
            {
              value: activity.percentage,
              disabled: true,
            },
            Validators.required,
          ],
          activityName: [activity.activityName, Validators.required],
          date: [
            {
              start: new Date(activity.startDateOfActivity),
              end: new Date(activity.endDateOfActivity),
            },
            Validators.required,
          ],
          college: activity.college,
          targetGroup: activity.targetGroup,
          numOfAttendees: [activity.numOfAttendees, Validators.required],
          totalTargetGroup: [activity.totalTargetGroup, Validators.required],
        })
      );
    }
  }

  upsert() {
    this.subs.sink = this.dialogService
      .open(AnnualReportConfirmationDialogComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
      })
      .onClose.pipe(switchMap((data) => of(data)))
      .subscribe((res) => {
        if (!res) {
          return;
        }
        const { college, year, guidanceServices } = this.form.getRawValue();
        let deleteIds = [];

        deleteIds = this.findUniqueIds(
          this.annualFormsActivities
            .filter(
              (activity) =>
                activity.college === college && activity.year === year
            )
            .map((x) => x.id),
          guidanceServices.map((x) => x.id)
        );

        for (const activity of guidanceServices) {
          this.annualFormService
            .saveForm({
              ...activity,
              college,
              year,
              startDateOfActivity: activity.date.start,
              endDateOfActivity: activity.date.end,
            })
            .subscribe((res) => {
              if (!res) {
                return;
              }
            });
        }

        if (deleteIds.length) {
          for (const id of deleteIds) {
            this.subs.sink = this.annualFormService
              .deleteActivityById(id)
              .subscribe();
          }
        }

        setTimeout(() => {
          this.isReportActionSelected = false;
          this.subs.sink = this.annualFormService
            .getAllActivities()
            .subscribe((res) => {
              if (!res) {
                return;
              }

              this.annualFormsActivities = res;
            });
          this.check();
        }, 200);
      });
  }

  findUniqueIds(arr1: number[], arr2: number[]): number[] {
    const uniqueIds: number[] = [];

    // Loop through the first array and add ids that are not in the second array
    for (const id of arr1) {
      if (!arr2.includes(id)) {
        uniqueIds.push(id);
      }
    }

    // Loop through the second array and add ids that are not in the first array
    for (const id of arr2) {
      if (!arr1.includes(id)) {
        uniqueIds.push(id);
      }
    }

    return uniqueIds;
  }
}
