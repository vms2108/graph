import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { chunk } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public fg: FormGroup = new FormGroup({
    costApartaments: new FormControl(),
    datesFrom: new FormControl(),
    datesTo: new FormControl(),
    cashMonth: new FormControl(),
    costRental: new FormControl(),
    cash: new FormControl(),
    percentCostChange: new FormControl(),
    percentSalaryChange: new FormControl(),
    percentCredit: new FormControl(),
  });
  public sections: any[] = [];
  public termCopy = 0;
  public currentDate = new Date();
  constructor(private fb: FormBuilder) {}
 ngOnInit() {
  this.fg = this.fb.group({
    cost_apartaments: 5,
    percent_cost_change: 10,

    percent_credit: 12,
    term_credit: 10,

    cash: 500,
    salary: 40,
    spending: 20,
    percent_salary_change: 15,
    percent_spending_change: 15,

    cost_rental: 20,
    percent_cost_rental_change: 10
  });
  this.getResult();
  this.fg.valueChanges.subscribe(() => {
    this.getResult();
  });
 }

 afterYear(value, persent) {
  return value * (1 + persent / 100);
 }

 getCashMonth(salary, spending, cost_rental) {
  return salary - spending - cost_rental;
 }

 getIf(value) {
  return !value.cost_apartaments || !value.cash || !value.salary;
 }

  getResult() {
    const value = this.fg.value;
    // if (this.getIf(value)) {
    //   return;
    // }
    console.log(value);
    let cost_apartaments = value.cost_apartaments * 1000000;
    let salary = value.salary * 1000;
    let spending = value.spending * 1000;
    let cost_rental = value.cost_rental * 1000;
    const cash = value.cash * 1000;
    const start_remain = cost_apartaments - cash;
    let remain = start_remain;
    let cash_month = this.getCashMonth(salary, spending, cost_rental);
    let i = 0;
    while (remain > 0) {
      i++;
      remain = start_remain - (cost_apartaments - value.cash) - cash_month * i;
      if ( i % 12 === 0) {
        cost_apartaments = this.afterYear(cost_apartaments, value.percent_cost_change);
        salary = this.afterYear(salary, value.percent_salary_change);
        spending = this.afterYear(spending, value.percent_spending_change);
        cost_rental = this.afterYear(cost_rental, value.percent_cost_rental_change);
        cash_month = this.getCashMonth(salary, spending, cost_rental);
      }
      if ( i >= 200 ) {
        return;
      }
    }
    this.termCopy = i;
  }

  get termCredit() {
    return 1;
  }
}
