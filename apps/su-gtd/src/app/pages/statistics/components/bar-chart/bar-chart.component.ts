import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'su-gtd-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective) public chart?: BaseChartDirective;

  @Input() labels: string[] = [];
  @Input() dataset = [];
  @Input() colors: string[] = [];
  @Input() options: ChartConfiguration<'bar'>['options'] = {};
  @Input() legend = false;
  @Input() classVariant = 'default';

  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.labels,
    datasets: this.dataset,
  };

  public barChartLabels: string[];

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
    indexAxis: 'y',
    scales: {
      xAxis: {
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      tooltip: {
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 16,
        },
      },
    },
  };

  isInit = false;

  ngOnInit(): void {
    this.isInit = true;
    this.barChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.dataset,
          backgroundColor: this.colors,
          hoverBackgroundColor: this.colors,
        },
      ],
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isInit) {
      return;
    }

    this.barChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.dataset,
          backgroundColor: this.colors,
          hoverBackgroundColor: this.colors,
        },
      ],
    };

    if (changes.dataset) {
      if (this.chart) {
        this.chart.update(this.barChartData);
      }
    }
  }
}
