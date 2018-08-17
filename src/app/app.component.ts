import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

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
  public termCopy = 0;
  public currentDate = new Date();
  constructor(private fb: FormBuilder) {}
 ngOnInit() {
  this.fg = this.fb.group({
    costApartaments: [null],
    datesFrom: this.currentDate,
    datesTo: this.currentDate,
    salary: [null],
    cashMonth: [null],
    costRental: [null],
    percentCostChange: [null],
    percentSalaryChange: [null],
    percentCredit: [null],
    cash: [null]
  });
  this.fg.valueChanges.subscribe(() => {
    this.getResult();
  });
 }

 getIf(value) {
  return !value.costApartaments || !value.cashMonth || !value.percentSalaryChange || !value.percentCostChange || !value.cash;
 }

  getResult() {
    const value = this.fg.value;
    if (this.getIf(value)) {
      return;
    }
    let remain = value.costApartaments - value.cash;
    let cashMonth = value.cashMonth;
    let costApartaments = value.costApartaments;
    const percentSalaryChange = 1 + value.percentSalaryChange / 100;
    const percentCostChange = 1 + value.percentCostChange / 100;
    let i = 0;
    while (remain > 0) {
      i++;
      remain = (costApartaments - value.cash) - cashMonth * i;
      if ( i % 12 === 0) {
        cashMonth = cashMonth * percentSalaryChange;
        costApartaments = costApartaments * percentCostChange;
      }
    }
    this.termCopy = i;
  }

  get termCredit() {
    return 1;
  }
}
