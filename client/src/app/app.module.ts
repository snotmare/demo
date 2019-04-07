import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherService } from './services/weather-service';
import { WeatherComponent } from './components/weather/weather.component';
import { WeatherSearchComponent } from './components/weather-search/weather-search.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    WeatherSearchComponent
  ],
  imports: [
	BrowserModule,
	BrowserAnimationsModule,
	HttpClientModule,
	AppRoutingModule,
	ReactiveFormsModule,
	MatInputModule,
	MatSelectModule,
	MatButtonModule
  ],
  providers: [
	  WeatherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
