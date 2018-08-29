import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CalculateService } from '../core/services/calculate.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {


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

  public fg: FormGroup = new FormGroup({});


  constructor(
    private calc: CalculateService
  ) {}
 ngOnInit() {
  this.startData();
  this.getResult();
  this.fg.valueChanges.subscribe(() => {
    this.getResult();
  });
  console.log(this.every_year);
 }

 getResult() {
  this.calc.getResult(this.fg.value);
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
}
