import type { RequestListener, IncomingMessage, ServerResponse } from 'http';
import { incomingMessageParseURL } from './httpUtils';
import { invariant } from './invariant';

type HttpRequestMethods = 'GET' | 'POST' |  'PUT' |  'PATCH' | 'DELETE';

type AsyncRequestListener<
	Request extends typeof IncomingMessage = typeof IncomingMessage,
	Response extends typeof ServerResponse = typeof ServerResponse,
> = (req: InstanceType<Request>, res: InstanceType<Response> & { req: InstanceType<Request> }) => Promise<void>;

interface RouteHandlers {
	method: HttpRequestMethods,
	path: string,
	handler: AsyncRequestListener
}

export class Router {
	handlers: RouteHandlers[] = [];

	public get(path: string, handler: AsyncRequestListener) {
		this.handlers.push({method: 'GET', path, handler});
		return this;
	}

	public post(path: string, handler: AsyncRequestListener) {
		this.handlers.push({method: 'POST', path, handler});
		return this;
	}

	public put(path: string, handler: AsyncRequestListener) {
		this.handlers.push({method: 'PUT', path, handler});
		return this;
	}

	private processNewRequest: AsyncRequestListener = async (request, response) => {
		const method = request.method;
		invariant(method, 'Malformed request was sent');
		
		const url = incomingMessageParseURL(request);

		for(const h of this.handlers) {
			if(h.method == method && h.path == url.pathname) {
				return await h.handler(request, response);
			}
		}

		response.write('404 Not Found');
		response.statusCode = 404;
		response.end();
	}

	get middleware(): RequestListener {
		return (request, response) => {
			this.processNewRequest(request, response)
				.catch(error => {
					response.write(`Error: ${error.message}`);
					response.statusCode = 400;
					response.end();
				});
		}
	}
}