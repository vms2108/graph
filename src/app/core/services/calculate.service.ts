import { Injectable } from '@angular/core';

@Injectable()
export class CalculateService {
  public term_accumulation = '';

  public result = {
    month_hypothec: 0,
    amount_hypothec: 0,
    amount_accumulate: 0,
    month_accumulate: 0,
    cost_apartsments: 0,
    amount_rental: 0
 };

  public every_year = {
    salary: [],
    spending: [],
    cost_rental: []
  };

  getTerm(value) {
    let {
      cost_apartaments,
      cash,
      salary,
      spending,
      cost_rental,
    } = this.getFormData(value);
    const {
      percent_cost_change,
      percent_salary_change,
      percent_spending_change,
      percent_cost_rental_change
    } = this.getFormData(value);
    let remain = cost_apartaments - cash;
    let cash_month = this.getCashMonth(salary, spending, cost_rental);
    let i = 0;
    while (remain > 0) {
      i++;
      cash_month = this.getCashMonth(salary, spending, cost_rental);
      cash = cash + cash_month;
      remain = (cost_apartaments - cash);
      cost_apartaments = this.afterMonth(cost_apartaments, percent_cost_change);
      spending = this.afterMonth(spending, percent_spending_change);
      if (i % 12 === 0) {
        cost_rental = this.afterYear(cost_rental, percent_cost_rental_change);
        salary = this.afterYear(salary, percent_salary_change);
      }
      if ( i >= 500 ) {
        this.getPhrase(500, true);
        return;
      }
    }
    this.getPhrase(i, false);
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

  getPhrase(n: number, big = false) {
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
  }

  getFormData(value) {
    // const value = this.fg.value;
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

  forecast(value) {
    this.every_year.salary = [];
    this.every_year.spending = [];
    this.every_year.cost_rental = [];
    const {
      salary,
      percent_salary_change,
      spending,
      percent_spending_change,
      cost_rental,
      percent_cost_rental_change
    } = this.getFormData(value);
    for (let i = 0; i < 10; i++) {
      this.every_year.salary.push(Math.round(this.afterYear(salary, percent_salary_change, i)));
      this.every_year.spending.push(Math.round(this.afterYear(spending, percent_spending_change, i)));
      this.every_year.cost_rental.push(Math.round(this.afterYear(cost_rental, percent_cost_rental_change, i)));
    }
  }

  getResult(value) {
    this.getTerm(value);
    this.getAmount(value);
    this.forecast(value);
  }

  getAmount(value) {
    let {
      cost_apartaments,
      cost_rental,
    } = this.getFormData(value);
    const {
      cash,
      percent_credit,
      percent_cost_rental_change,
      percent_cost_change,
      term_credit
    } = this.getFormData(value);
    const amount = cost_apartaments - cash;
    const n = term_credit * 12;
    const i = percent_credit / 100 / 12;
    const month_hypothec = Math.round(amount * (i * Math.pow((1 + i), n) / (Math.pow((1 + i), n) - 1)));
    const amount_hypothec = month_hypothec * n;
    let amount_rental = 0;
    for ( let j = 1; j <= n; j++) {
      if (j % 12 === 0) {
        cost_rental = this.afterYear(cost_rental, percent_cost_rental_change);
        cost_apartaments = this.afterYear(cost_apartaments, percent_cost_change);
      }
      amount_rental += cost_rental;
    }
    const cost_apartsments = Math.round(cost_apartaments);
    amount_rental = Math.round(amount_rental);
    const amount_accumulate = Math.round(cost_apartaments - cash + amount_rental);
    const month_accumulate = Math.round(amount_accumulate / n);
    this.result = {
      month_hypothec,
      amount_hypothec,
      cost_apartsments,
      amount_rental,
      amount_accumulate,
      month_accumulate
    };
  }
}
