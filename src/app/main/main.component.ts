import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CalculateService } from '../core/services/calculate.service';
import Plotly from 'plotly.js-basic-dist';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {


 public initial_data = {
  cost_apartaments: 5,
  percent_cost_change: 1,

  percent_credit: 10,
  term_credit: 10,

  cash: 500,
  salary: 41.5,
  spending: 18,
  percent_salary_change: 30,
  percent_spending_change: 15,

  cost_rental: 18,
  percent_cost_rental_change: 5
 };

 private options = {
  staticPlot: true,
  displayModeBar: false
};

private layout: any = {
  showlegend: false,
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  xaxis: {
    type: 'linear',
    range: [-350, 5500],
    tickfont: {
      size: 10,
      color: '#7c7c90'
    },
    tickmode: 'linear',
    tick0: 1000,
    dtick: '1000',
    zeroline: false
  },
  yaxis: {
    type: 'linear',
    autorange: true,
    tickfont: {
      size: 10,
      color: '#7c7c90'
    },
    tickmode: 'auto',
    nticks: 20
  },
  margin: {
    l: 20,
    r: 20,
    b: 20,
    t: 10,
    pad: 0
  },
};

  private chart: any;

  public fg: FormGroup = new FormGroup({});

  @ViewChild('myChart')
  myChart: ElementRef;

  get chartEl() {
    return this.myChart.nativeElement;
  }


  constructor(
    private calc: CalculateService
  ) {}
 ngOnInit() {
  this.startData();
  this.getResult();
  this.fg.valueChanges.subscribe(() => {
    this.getResult();
  });
 }

 ngAfterViewInit() {
  this.chart = Plotly.newPlot(this.chartEl, this.calc.graphic.data, this.calc.graphic.layout, this.options);
}

 getResult() {
  this.calc.getResult(this.fg.value);
  this.chart = Plotly.newPlot(this.chartEl, this.calc.graphic.data, this.calc.graphic.layout, this.options);
 }

 startData() {
  this.calc.blocks.forEach((block) => {
    block.values.forEach(value => {
      const item = value.name;
      this.fg.addControl(item, new FormControl(this.initial_data[item]));
    });
  });
 }

  get blocks() {
    return this.calc.blocks;
  }

  get results() {
    return this.calc.results;
  }

  get every_year() {
    return this.calc.every_year;
  }

  get graphic() {
    return this.calc.graphic;
  }

  get amount_month() {
    return {
      x1: this.calc.graphic_data.x_accumulation,
      x2: this.calc.graphic_data.x_hypothec
    };
  }
}
