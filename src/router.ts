import type { RequestListener } from 'http';
import { invariant } from './invariant';

type HttpRequestMethods = 'GET' | 'POST' |  'PUT' |  'PATCH' | 'DELETE';

interface RouteHandlers {
	method: HttpRequestMethods,
	path: string,
	handler: RequestListener
}

export class Router {
	handlers: RouteHandlers[] = [];

	public get(path: string, handler: RequestListener) {
		this.handlers.push({method: 'GET', path, handler});
		return this;
	}

	public post(path: string, handler: RequestListener) {
		this.handlers.push({method: 'POST', path, handler});
		return this;
	}

	public put(path: string, handler: RequestListener) {
		this.handlers.push({method: 'PUT', path, handler});
		return this;
	}

	private processNewRequest: RequestListener = (request, response) => {
		const method = request.method;
		const stringURL = request.url;

		invariant(!!method && !!stringURL, 'Malformed request was sent');
		const url = new URL(stringURL, `http://${request.headers.host}`);

		const isSomeHandlerTriggered = this.handlers.some(h => {
			if(h.method == method && h.path == url.pathname) {
				h.handler(request, response);
				return true
			}
			return false;
		});

		if(!isSomeHandlerTriggered) {
			response.write('404 Not Found');
			response.statusCode = 404;
			response.end();
		}
	}

	get middleware(): RequestListener {
		return (request, response) => {
			try {
				this.processNewRequest(request, response)
			}
			catch (error) {
				response.write(`Error: ${error.message}`);
				response.statusCode = 400;
				response.end();
			}
		}
	}
}