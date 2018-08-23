import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public percent_settings = {
    min: 1,
    max: 100,
    step: 0.1
  };
  public cost_apartaments_settings = {
    min: 1,
    max: 100,
    step: 0.1
  };
  public term_credit_settings = {
    min: 1,
    max: 30,
    step: 1
  };
  public cash_settings = {
    min: 10,
    max: 10000,
    step: 10
  };
  public money_settings = {
    min: 1,
    max: 500,
    step: 0.5
  };
  public fg: FormGroup = new FormGroup({});
  public sections: any[] = [];
  public term_accumulation = '';
  public month_hypothec = 0;
  public amount_hypothec = 0;
  public amount_accumulate = 0;
  public month_accumalate = 0;
  public cost_apartsments = 0;
  public amount_rental = 0;
  public salary_every_year = [];

  public currentDate = new Date();
  constructor(private fb: FormBuilder) {}
 ngOnInit() {
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
  this.getResult();
  this.fg.valueChanges.subscribe(() => {
    this.getResult();
  });
 }

  getResult() {
    this.getTerm();
    this.getAmount();
  }

  getTerm() {
    const value = this.fg.value;
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
      cash = cash + cash_month;
      remain = (cost_apartaments - cash);
      cost_apartaments = this.afterMonth(cost_apartaments, value.percent_cost_change);
      spending = this.afterMonth(spending, value.percent_spending_change);
      if (i % 12 === 0) {
        cost_rental = this.afterYear(cost_rental, value.percent_cost_rental_change);
        salary = this.afterYear(salary, value.percent_salary_change);
      }
      if ( i >= 500 ) {
        this.term(500, true);
        return;
      }
    }
    this.term(i, false);
  }

  getAmount() {
    const {
       cost_apartaments,
      cash,
      percent_credit,
      cost_rental,
      percent_cost_rental_change,
      percent_cost_change,
      term_credit
    } = this.getFormData();
    let new_cost_rental = cost_rental;
    let new_cost_apartaments = cost_apartaments;
    const amount = cost_apartaments - cash;
    const n = term_credit * 12;
    const i = percent_credit / 100 / 12;
    this.month_hypothec = Math.round(amount * (i * Math.pow((1 + i), n) / (Math.pow((1 + i), n) - 1)));
    this.amount_hypothec = this.month_hypothec * n;
    let amount_rental = 0;
    for ( let j = 1; j <= n; j++) {
      if (j % 12 === 0) {
        new_cost_rental = this.afterYear(new_cost_rental, percent_cost_rental_change);
        new_cost_apartaments = this.afterYear(new_cost_apartaments, percent_cost_change);
      }
      amount_rental += new_cost_rental;
    }
    this.cost_apartsments = Math.round(new_cost_apartaments);
    this.amount_rental = Math.round(amount_rental);
    this.amount_accumulate = Math.round(new_cost_apartaments - cash + amount_rental);
    this.month_accumalate = Math.round(this.amount_accumulate / n);
  }

  getFormData() {
    const value = this.fg.value;
    return {
      cost_apartaments: value.cost_apartaments * 1000000,
      percent_cost_change: 1,
      percent_credit: value.percent_credit,
      term_credit: value.term_credit,
      cash: value.cash * 1000,
      salary: value.salary * 1000,
      spending: value.spending * 1000,
      percent_salary_change: value.percent_salary_change,
      percent_spending_change: value.percent_spending_change,
      cost_rental: value.cost_rental * 1000,
      percent_cost_rental_change: value.percent_cost_rental_change
    };
  }

  afterYear(value, persent, year = 1) {
    return value * Math.pow((1 + persent / 100), year);
  }

  afterMonth(value, persent) {
    return value * (1 + persent / 12 / 100);
  }

  getCashMonth(salary, spending, cost_rental) {
    return salary - spending - cost_rental;
  }

  term(n: number, big = false) {
    if (big) {
      this.term_accumulation = 'Слишком долго копить';
      return;
    }
    const year = Math.round(n / 12);
    const month = n % 12;
    if (year === 0 && month === 0) {
      this.term_accumulation = 'Уже накопил';
      return;
    }
    const last_num = Number(String(year).substr(String(year).length - 1, 1));
    const year_phrase = (year === 0) ? ''
      : (last_num === 0) ? year + ' лет'
      : (last_num < 4) ? year + ' года '
      : year + ' лет';
    const month_phrase = (month === 0) ? '' :
      (month === 1) ? ' и ' + month + ' месяц'
      : (month <= 4) ? ' и ' + month + ' месяца'
      : ' и ' + month + ' месяцев';
    this.term_accumulation = 'Накопишь через ' + year_phrase + month_phrase;
    this.salary_every_year = [];
    const {
      salary,
      percent_salary_change
    } = this.getFormData();
    for (let i = 0; i < year; i++) {
      this.salary_every_year.push(Math.round(this.afterYear(salary, percent_salary_change, i)));
    }
  }
}
