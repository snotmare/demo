import * as bodyParser from 'body-parser';
import { Express, Request, Response } from 'express';
import { Degree, StringUtils, WeatherSearch } from 'shared';
import * as weather from 'weather-js';

export class WeatherRouter {
	constructor(app: Express) {
		app.use(bodyParser.json());

		app.post('/weather', (request: Request, response: Response) => {
			try {
				this.getWeather(request, response);
			} catch(error) {
				response.status(400).send(`${error}`);
			}
		});
	}

	private getWeather(request: Request, response: Response) {
		let search = <WeatherSearch>request.body;
		this.validateSearch(search);

		let cityState = search.city + ', ' + search.state;

		// respond with weather api's result
		weather.find({search: cityState, degreeType: search.degreeType}, (err: Error, result: any) => {
			if(err) {
				throw err;
			} else {
				result[0].forecast.forEach((day: any) => {
					day.imageUrl = result[0].location.imagerelativeurl + 'law/' + day.skycodeday + '.gif';
				});
				response.json(result[0]).send;
			}
		});
	}

	private validateSearch(search: WeatherSearch) {
		if (StringUtils.isEmpty(search.city)) {
			throw new Error('City is required.');
		}

		if(StringUtils.isEmpty(search.state)) {
			throw new Error('State is required.');
		}

		if(StringUtils.isEmpty(search.degreeType)) {
			throw new Error('Degree Type is required.');
		}

		if(!Object.values(Degree).includes(search.degreeType)) {
			throw new Error('Degree Type is invalid.');
		}
	}
}