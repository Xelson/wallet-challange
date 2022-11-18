import { Router } from "./router";

export const ApplicationRouter = new Router();

ApplicationRouter
	.get('/', (req, res) => {
		console.log(req, res);

		res.end();
	})
	.get('/test', (req, res) => {
		console.log(req, res);
		
		res.end();
	})