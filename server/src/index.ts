import * as express from 'express';
import { WeatherRouter } from './weather-router';
import * as cors from 'cors';

let app = express();
app.use(cors());

app.get('/', function (request: express.Request, response: express.Response) {
	response.send('Hello World!');
});

new WeatherRouter(app);

app.listen(3000, () => {
	console.log('Magic happens on port 3000');
});