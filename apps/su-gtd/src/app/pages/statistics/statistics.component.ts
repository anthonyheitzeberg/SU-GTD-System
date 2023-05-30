import {
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Colleges, GuidanceServices } from '@su-gtd/api-enums';
import { AnnualFormService } from '../annual-report/annual-form.service';
import { SubSink } from 'subsink';
import { AnnualFormActivity } from '@su-gtd/api-interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'su-gtd-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  private subs = new SubSink();

  activitiesByYearForm!: FormGroup;
  comparisonCollegesForm!: FormGroup;

  @ViewChildren(BaseChartDirective)
  charts: QueryList<BaseChartDirective>;

  years: number[] = [];
  colleges = Colleges;
  collegeADataset = [];
  collegeBDataset = [];

  collegeActivitiesDataset = [];
  guidanceServicesCollegeDataset = [];

  guidanceServices = [...Object.values(GuidanceServices)];
  collegesList = [...Object.values(Colleges)];

  activities: AnnualFormActivity[] = [];
  filteredActivitiesByYear: AnnualFormActivity[] = [];

  totalNumOfActivities = 0;
  totalNumOfActivitiesYear = 0;
  isShowingComparisons = false;

  public barChartColors = [
    '#7FB3D5',
    '#79C7D8',
    '#FFB347',
    '#FFA07A',
    '#81C784',
    '#8BC34A',
    '#FFD1DC',
    '#F06292',
    '#CE93D8',
    '#BA68C8',
    '#FFCDD2',
    '#FFE0B2',
    '#D4AC0D',
    '#BDBD8B',
    '#FF8A65',
    '#FF7043',
  ];
  public barChartColors2 = [
    '#7FB3D5',
    '#79C7D8',
    '#FFB347',
    '#FFA07A',
    '#81C784',
    '#8BC34A',
  ];

  public barComparisonChartColors = [
    '#ffa1b5',
    '#86c7f3',
    '#ffe29a',
    '#93d9d9',
    '#fed29d',
    '#d77ae4',
  ];

  constructor(
    private annualFormService: AnnualFormService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.generateYearSelection();
    this.subs.sink = this.annualFormService
      .getAllActivities()
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.activities = res;
        this.totalNumOfActivities = res.length;
      });

    this.activitiesByYearForm = this.fb.group({
      year: [new Date().getFullYear()],
    });

    this.comparisonCollegesForm = this.fb.group({
      collegeA: [null, Validators.required],
      collegeB: [null, Validators.required],
      year: [new Date().getFullYear()],
    });

    setTimeout(() => {
      this.showData();
    }, 200);
  }

  /**
   * This is to generate a list of years that can be selected
   * @param startYear
   */
  generateYearSelection(startYear = 2013) {
    let endDate = new Date().getFullYear();
    for (let i = endDate; i >= startYear; i--) {
      this.years.push(endDate);
      endDate--;
    }
  }

  /**
   * This is to generate and update the charts data that will passed into the respective chart components
   */
  showData() {
    this.collegeActivitiesDataset = [];
    this.guidanceServicesCollegeDataset = [];
    const year = this.activitiesByYearForm.get('year').value;
    this.filteredActivitiesByYear = this.activities.filter(
      (activity) => activity.year === year
    );
    this.totalNumOfActivitiesYear = this.filteredActivitiesByYear.length;
    for (const [i, value] of this.collegesList.entries()) {
      this.collegeActivitiesDataset[i] =
        this.filteredActivitiesByYear.filter(
          (activity) => activity.college === value
        ).length ?? 0;
    }
    for (const [i, value] of this.guidanceServices.entries()) {
      this.guidanceServicesCollegeDataset[i] =
        this.filteredActivitiesByYear.filter(
          (activity) => activity.guidanceServiceType === value
        ).length ?? 0;
    }
    this.ref.detectChanges();
  }

  /**
   * This is to show the two bar charts that compare two colleges by guidance services
   * @returns null
   */
  showComparisonData() {
    const { year, collegeA, collegeB } =
      this.comparisonCollegesForm.getRawValue();

    if (!year || !collegeA || !collegeB) {
      return;
    }

    this.isShowingComparisons = true;
    const filteredActivities = this.activities.filter(
      (activity) => activity.year === year
    );

    this.collegeADataset = this.guidanceServices.map((guidanceService) => {
      return filteredActivities.filter(
        (x) =>
          x.college === collegeA && x.guidanceServiceType === guidanceService
      ).length;
    });
    this.collegeBDataset = this.guidanceServices.map((guidanceService) => {
      return filteredActivities.filter(
        (x) =>
          x.college === collegeB && x.guidanceServiceType === guidanceService
      ).length;
    });
  }
}
