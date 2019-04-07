import { Component, OnInit } from '@angular/core';
import { Degree, Weather, WeatherSearch } from 'shared';
import { WeatherService } from 'src/app/services/weather-service';

@Component({
	selector: 'app-weather-search',
	templateUrl: './weather-search.component.html',
	styleUrls: ['./weather-search.component.scss']
})
export class WeatherSearchComponent implements OnInit {
	weather: Weather;

	constructor(private weatherService: WeatherService) {
	}

	ngOnInit() {
		let search: WeatherSearch = {
			city: 'Lincoln',
			state: 'NE',
			degreeType: Degree.FAHRENHEIT
		};

		this.search(search);
	}
	
	private async search(search: WeatherSearch) {
		this.weather = await this.weatherService.getLocation({
			city: search.city,
			state: search.state,
			degreeType: Degree.FAHRENHEIT
		}).toPromise();
	}
}
