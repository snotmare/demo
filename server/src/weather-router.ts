import * as bodyParser from 'body-parser';
import { Express, Request, Response } from 'express';
import { Degree, ObjectUtils, StringUtils, WeatherSearch } from 'shared';
import * as weather from 'weather-js';

export class WeatherRouter {
	cache: Cache;

	constructor(app: Express) {
		this.cache = new Cache();
		this.cache.items = [];
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

		// try to respond with the cached result.
		let cachedResult = this.getCachedResult(search);
		if (!ObjectUtils.isEmpty(cachedResult)) {
			return response.json(cachedResult).send;
		}

		// respond with weather api's result
		let instance = this;
		weather.find({search: cityState, degreeType: search.degreeType}, (err: Error, result: any) => {
			if(err) {
				throw err;
			} else {
				result[0].forecast.forEach((day: any) => {
					day.imageUrl = result[0].location.imagerelativeurl + 'law/' + day.skycodeday + '.gif';
				});
				response.json(result[0]).send;

				// update the cache - no need to slow the request down for this
				instance.updateCachedResult(search, result[0]);
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

	private getCachedResult(search: WeatherSearch): any {
		let i = this.findCacheItem(search);
		if (!ObjectUtils.isEmpty(i)) {
			if (Date.now() - this.cache.items[i].lastUpdated >= 60000) {
				return undefined;
			}
			return this.cache.items[i].result;
		}
		return undefined;
	}

	private updateCachedResult(search: WeatherSearch, result: any) {
		let i = this.findCacheItem(search);
		if (!ObjectUtils.isEmpty(i)) {
			this.cache.items[i].result = result;
			this.cache.items[i].lastUpdated = Date.now();
			return;
		}
		this.addCacheItem(search, result);
	}

	private findCacheItem(search: WeatherSearch): number {
		for (let i = 0; i < this.cache.items.length; i++) {
			const cacheItem = this.cache.items[i];
			if (cacheItem.search.city === search.city
			&& cacheItem.search.state === search.state
			&& cacheItem.search.degreeType === search.degreeType) {
				return i;
			}
		}
		return undefined;
	}

	private addCacheItem(search: WeatherSearch, result: any) {
		let item = new CacheItem();
		item.search = search;
		item.result = result;
		item.lastUpdated = Date.now();
		this.cache.items.push(item);
	}
}

class Cache {
	items: CacheItem[];
}

class CacheItem {
	search: WeatherSearch;
	result: any;
	lastUpdated: number;
}