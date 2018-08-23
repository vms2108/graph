import { Component, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { SliderInputSettings } from './slider-input.model';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormSliderInputComponent),
  multi: true
};

@Component({
  selector: 'app-form-slider-input',
  templateUrl: 'form-slider-input.component.html',
  styleUrls: ['form-slider-input.component.scss'],
  providers: [CONTROL_ACCESSOR]
})
export class FormSliderInputComponent implements ControlValueAccessor {
  @Input()
  set settings(value: SliderInputSettings) {
    this.slider = value;
    this.onValueChange(this.value);
  }
  @Input() label: string;

  @ViewChild('myInput') myInputEl: ElementRef;

  public value = 0;
  public slider: SliderInputSettings;

  public inputVal: any = 0;
  public sliderVal = 0;

  private onTouch: Function = () => {};
  private onModelChange: Function = () => {};

  constructor() {}

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  registerOnChange(fn) {
    this.onModelChange = fn;
  }

  writeValue(value) {
    this.value = value || 0;
    this.sliderVal = this.value;
    this.inputVal = this.value;
  }

  onSliderChange(event: MatSliderChange) {
    this.onValueChange(event.value);
  }

  onInput(e: any) {
    // this.onValueChange(e.target.value);
  }

  onKeyPress(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      this.onChange(e);
    }
  }

  onChange(e: any) {
    const value = (<any>e.target).value;
    this.onValueChange(e.target.value);
  }

  onValueChange(value: any) {
    value = this.prepareAmount(value);
    if (!this.slider) {
      return;
    }
    if (value < this.slider.min) {
      value = this.slider.min;
    } else if (value > this.slider.max) {
      value = this.slider.max;
    }

    if (this.value === value) {
      setTimeout(() => {
        this.myInputEl.nativeElement.value = value;
      }, 10);
    }

    this.onModelChange(value);
    this.inputVal = value;
    this.sliderVal = value;
    this.value = value;
  }

  prepareAmount(num: number | string): number {
    num = num.toString();
    num = num.replace(/\s+/g, '');
    const amount = parseFloat(num);
    if (!amount || typeof amount !== 'number') {
      return 0;
    }
    return amount;
  }

  handleCommaKeyForInput(event: Event) {
    const target = <HTMLInputElement>event.target;
    const value = target.value;
    target.value = value.replace(/,/g, '.');
  }
}
