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
    salary: 41.5,
    spending: 18,
    percent_salary_change: 60,
    percent_spending_change: 15,

    cost_rental: 18,
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

 afterMonth(value, persent) {
  return value * (1 + persent / 12 / 100);
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
    let cost_apartaments = value.cost_apartaments * 1000000;
    let salary = value.salary * 1000;
    let spending = value.spending * 1000;
    let cost_rental = value.cost_rental * 1000;
    let cash = value.cash * 1000;
    const start_remain = cost_apartaments - cash;
    let remain = start_remain;
    let cash_month = this.getCashMonth(salary, spending, cost_rental);
    let i = 0;
    while (remain > 0) {
      i++;
      cash_month = this.getCashMonth(salary, spending, cost_rental);
      console.log(cash_month);
      cash = cash + cash_month;
      remain = (cost_apartaments - cash);
      cost_apartaments = this.afterMonth(cost_apartaments, value.percent_cost_change);
      spending = this.afterMonth(spending, value.percent_spending_change);
      if (i % 12 === 0) {
        cost_rental = this.afterYear(cost_rental, value.percent_cost_rental_change);
        salary = this.afterYear(salary, value.percent_salary_change);
      }
      if ( i >= 500 ) {
        this.termCopy = 500;
        return;
      }
    }
    this.termCopy = i;
  }

  get termCredit() {
    return 1;
  }
}
