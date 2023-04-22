import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartConfiguration, Color } from 'chart.js';
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

  public barChartLegend = false;
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
    console.log(this.dataset);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isInit) {
      return;
    }
    console.log(this.labels, this.dataset);
    this.barChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.dataset,
          backgroundColor: [
            '#ffa1b5',
            '#86c7f3',
            '#ffe29a',
            '#93d9d9',
            '#fed29d',
            '#d77ae4',
          ],
          hoverBackgroundColor: new Array(6).fill('#fc2947'),
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
