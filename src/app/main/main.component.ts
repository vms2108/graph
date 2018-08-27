import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CalculateService } from '../core/services/calculate.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

 public settings = {
   percent: {
    min: 1,
    max: 100,
    step: 0.1
   },
   cost_apartaments: {
    min: 1,
    max: 100,
    step: 0.1
   },
   term_credit: {
    min: 1,
    max: 30,
    step: 1
   },
   cash: {
    min: 10,
    max: 10000,
    step: 10
   },
   money: {
    min: 1,
    max: 500,
    step: 0.5
   }
 };

  public fg: FormGroup = new FormGroup({});


  public graph = {
    data: [
        { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
        { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
    ],
    layout: {width: 320, height: 240, title: 'A Fancy Plot'}
  };


  constructor(
    private fb: FormBuilder,
    private calc: CalculateService
  ) {}
 ngOnInit() {
  this.startData();
  this.getResult();
  this.fg.valueChanges.subscribe(() => {
    this.getResult();
  });
 }

 getResult() {
  this.calc.getResult(this.fg.value);
 }

 startData() {
  this.fg = this.fb.group({
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
  });
 }
}
