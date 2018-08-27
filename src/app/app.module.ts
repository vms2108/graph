import { PlotlyModule } from 'angular-plotly.js';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormSliderInputComponent } from './form-slider-input/form-slider-input.component';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { CoreModule } from './core/core.module';

@NgModule({
   declarations: [
      AppComponent,
      FormSliderInputComponent,
      MainComponent
   ],
   imports: [
      BrowserModule,
      MaterialModule,
      BrowserAnimationsModule,
      ReactiveFormsModule,
      PlotlyModule,
      CommonModule,
      CoreModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
