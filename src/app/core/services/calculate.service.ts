import { Injectable } from '@angular/core';

@Injectable()
export class CalculateService {
  public term_accumulation = '';
  public results = [
   {
    title: 'С ипотекой',
    values: [
      {
        name: 'month_hypothec',
        value: 0,
        label: 'Платить в месяц'
      },
      {
        name: 'amount_hypothec',
        value: 0,
        label: 'Выплатить за весь срок'
      }
    ]
    },
    {
      title: 'С арендой',
      values: [
        {
          name: 'cost_apartsments',
          value: 0,
          label: 'Стоимость квартиры к тому времени'
        },
        {
          name: 'amount_rental',
          value: 0,
          label: 'Стоимость аренды'
        },
        {
          name: 'amount_accumulate',
          value: 0,
          label: 'Всего'
        },
        {
          name: 'month_accumulate',
          value: 0,
          label: 'Ежемесячно'
        }
      ]
    }
  ];

  public every_year = [{
    salary: 0,
    spending: 0,
    cost_rental: 0
  }];

  public blocks = [
    {
      title: 'Квартира',
      values: [
        {
          name: 'cost_apartaments',
          settings: 'cost_apartaments',
          label: 'Стоимость квартиры, млн руб'
        },
        {
          name: 'percent_cost_change',
          settings: 'percent',
          label: 'Изменение стоимости квартиры в год, %'
        }
      ]
    },
    {
      title: 'Условия ипотеки',
      values: [
        {
          name: 'percent_credit',
          settings: 'percent',
          label: 'Годовая ставка, %'
        },
        {
          name: 'term_credit',
          settings: 'term_credit',
          label: 'Срок, лет'
        }
      ]
    },
    {
      title: 'Аренда',
      values: [
        {
          name: 'cost_rental',
          settings: 'money',
          label: 'Стоимость аренды в месяц, тыс руб'
        },
        {
          name: 'percent_cost_rental_change',
          settings: 'percent',
          label: 'Изменение стоимости аренды в год, %'
        }
      ]
    },
    {
      title: 'Финансы',
      values: [
        {
          name: 'cash',
          settings: 'cash',
          label: 'Уже накопленная сумма, тыс руб'
        },
        {
          name: 'salary',
          settings: 'money',
          label: 'Месячная зарплата, тыс руб'
        },
        {
          name: 'spending',
          settings: 'money',
          label: 'Месячные затраты без учета проживания, тыс руб'
        },
        {
          name: 'percent_salary_change',
          settings: 'percent',
          label: 'Изменение зарплаты за год, %'
        },
        {
          name: 'percent_spending_change',
          settings: 'percent',
          label: 'Изменение месячных затрат за год, %'
        }
      ]
    }
  ];

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

  public graphic = {
    data: [],
    layout: {}
  };

  public graphic_data = {
    accumulation: [],
    hypothec: [],
    x_accumulation: [],
    x_hypothec: []
  };

  constructor() {
    this.getBlocks();
  }

  getResult(value) {
    this.getTerm(value);
    this.getAmount(value);
    this.forecast(value);
    this.getGraphic();
  }

  getTerm(value) {
    const arrx = [];
    const arry = [];
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
      arrx.push(i);
      arry.push(cash);
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
    this.graphic_data.accumulation = arry;
    this.graphic_data.x_accumulation = arrx;
  }

  getAmount(value) {
    const arrx = [];
    const arry = [];
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
    let pay = cash;
    arrx.push(0);
    arry.push(pay);
    for ( let j = 1; j <= n; j++) {
      pay += month_hypothec;
      arrx.push(j);
      arry.push(pay);
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
    this.results.forEach( result => {
      result.values.map(item => {
        item.value =
        (item.name === 'month_hypothec') ? month_hypothec
        : (item.name === 'amount_hypothec') ? amount_hypothec
        : (item.name === 'cost_apartsments') ? cost_apartsments
        : (item.name === 'amount_rental') ? amount_rental
        : (item.name === 'amount_accumulate') ? amount_accumulate
        : month_accumulate;
      });
    });
    this.graphic_data.hypothec = arry;
    this.graphic_data.x_hypothec = arrx;
  }

  forecast(value) {
    this.every_year = [];
    const {
      salary,
      percent_salary_change,
      spending,
      percent_spending_change,
      cost_rental,
      percent_cost_rental_change
    } = this.getFormData(value);
    for (let i = 0; i < 10; i++) {
      this.every_year.push({
        salary: Math.round(this.afterYear(salary, percent_salary_change, i)),
        spending: Math.round(this.afterYear(spending, percent_spending_change, i)),
        cost_rental: Math.round(this.afterYear(cost_rental, percent_cost_rental_change, i))
      });
    }
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

  getBlocks() {
    return this.blocks.forEach(block => {
      block.values.map(value => {
        value.settings = this.settings[value.settings];
      });
    });
  }

  getGraphic() {
    const x1 = this.graphic_data.x_accumulation;
    const x2 = this.graphic_data.x_hypothec;
    const y1 = this.graphic_data.accumulation;
    const y2 = this.graphic_data.hypothec;
    const x = (x1 > x2) ? x1 : x2;
    this.graphic = {
      data: [
        { x,
          y: y1,
          type: 'scatter',
          mode: 'lines+points',
          marker: {color: 'red'},
          line: {color: '#009CFF'},
          name: `Накопления за ${x1.length} месяцев`
        },
        { x,
          y: y2,
          type: 'scatter',
          mode: 'lines+points',
          marker: {color: 'red'},
          line: {color: '#ff9d7c'},
          name: `Ипотека за ${x2.length - 1} месяцев`
        },
      ],
      layout: {
        width: 620,
        height: 440,
        title: 'Сумма в зависимости от месяца',
        paper_bgcolor: '#2D2D37',
        plot_bgcolor: 'transparent',
        font: {
          color: 'white'
        }
      }
    };
  }
}
