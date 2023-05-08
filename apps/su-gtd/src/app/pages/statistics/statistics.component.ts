import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Colleges, GuidanceServices } from '@su-gtd/api-enums';
import { AnnualFormService } from '../annual-report/annual-form.service';
import { SubSink } from 'subsink';
import { AnnualFormActivity } from '@su-gtd/api-interfaces';
import { ChartData, ChartDataset, ChartOptions, TooltipItem } from 'chart.js';
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
  guidanceServices = [...Object.values(GuidanceServices)];
  collegesList = [...Object.values(Colleges)];
  activities: AnnualFormActivity[] = [];
  filteredActivitiesByYear: AnnualFormActivity[] = [];
  totalNumOfActivities = 0;
  totalNumOfActivitiesYear = 0;
  isShowingComparisons = false;

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
      },
      tooltip: {
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 16,
        },
        callbacks: {
          label: (tooltipItem: TooltipItem<'pie'>) => {
            return `${tooltipItem.label}\nwith ${tooltipItem.parsed} ${
              tooltipItem.parsed > 1 ? 'activities' : 'activity'
            }`;
          },
          afterBody: (tooltipItems: TooltipItem<'pie'>[]) => {
            let bodyText = '';
            for (const service of this.guidanceServices) {
              bodyText += `\n${service}- ${
                this.filteredActivitiesByYear.filter(
                  (activity) =>
                    activity.college === tooltipItems[0].label &&
                    activity.guidanceServiceType === service
                ).length
              }`;
            }
            return `${Math.round(
              (tooltipItems[0].parsed / this.totalNumOfActivitiesYear) * 100
            )}% of activities for ${
              this.activitiesByYearForm.get('year').value
            }${bodyText}`;
          },
        },
      },
    },
  };
  public pieChartLabels = [...Object.values(Colleges)];
  public pieChartColors = [
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
  public pieChartDatasets: ChartDataset<'pie', number[]>[] = [
    {
      data: new Array(16).fill(0),
      backgroundColor: this.pieChartColors,
      hoverBackgroundColor: this.pieChartColors,
      hoverBorderColor: new Array(16).fill('#ffffff00'),
    },
  ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public pieChartOptions2: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
        align: 'center',
      },
      tooltip: {
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 16,
        },
        callbacks: {
          label: (tooltipItem: TooltipItem<'pie'>) => {
            return `${tooltipItem.label}\nwith ${tooltipItem.parsed} ${
              tooltipItem.parsed > 1 ? 'activities' : 'activity'
            }`;
          },
          afterBody: (tooltipItems: TooltipItem<'pie'>[]) => {
            let bodyText = '';
            for (const college of this.collegesList) {
              bodyText += `\n${college}- ${
                this.filteredActivitiesByYear.filter(
                  (activity) =>
                    activity.college === college &&
                    activity.guidanceServiceType === tooltipItems[0].label
                ).length
              }`;
            }
            return `${Math.round(
              (tooltipItems[0].parsed / this.totalNumOfActivitiesYear) * 100
            )}% of activities for ${
              this.activitiesByYearForm.get('year').value
            }${bodyText}`;
          },
        },
      },
    },
  };
  public pieChartLabels2 = [...Object.values(GuidanceServices)];
  public pieChartColors2 = [
    '#7FB3D5',
    '#79C7D8',
    '#FFB347',
    '#FFA07A',
    '#81C784',
    '#8BC34A',
  ];
  public pieChartDatasets2: ChartDataset<'pie', number[]>[] = [
    {
      data: new Array(6).fill(0),
      backgroundColor: this.pieChartColors,
      hoverBackgroundColor: this.pieChartColors,
      hoverBorderColor: new Array(6).fill('#ffffff00'),
    },
  ];
  public pieChartLegend2 = true;
  public pieChartPlugins2 = [];

  constructor(
    private annualFormService: AnnualFormService,
    private fb: FormBuilder
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
    }, 300);
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
    const year = this.activitiesByYearForm.get('year').value;
    this.filteredActivitiesByYear = this.activities.filter(
      (activity) => activity.year === year
    );
    this.totalNumOfActivitiesYear = this.filteredActivitiesByYear.length;
    for (const [i, value] of this.pieChartLabels.entries()) {
      this.pieChartDatasets[0].data[i] =
        this.filteredActivitiesByYear.filter(
          (activity) => activity.college === value
        ).length ?? 0;
    }
    for (const [i, value] of this.pieChartLabels2.entries()) {
      this.pieChartDatasets2[0].data[i] =
        this.filteredActivitiesByYear.filter(
          (activity) => activity.guidanceServiceType === value
        ).length ?? 0;
    }

    this.charts.forEach((c) => {
      c.update();
    });
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
