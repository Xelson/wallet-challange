import { IncomingMessage } from "http";
import { RowDataPacket } from "mysql2";
import querystring from 'node:querystring';
import { invariant } from "./invariant";

export type FromRequest<T> = (T & RowDataPacket)[];

export async function incomingMessageReadBody(message: IncomingMessage) {
	let data = '';

	return new Promise<string>((resolve, reject) => {
		message.once('data', chunk => data += chunk);
		message.once('end', () => resolve(data));
		message.once('error', reject);
	});
}

export function incomingMessageParseURL(message: IncomingMessage) {
	const stringURL = message.url;
	invariant(stringURL, 'Malformed request was sent');

	return new URL(stringURL, `http://${message.headers.host}`);
}

export async function incomingMessageParseQueryString(message: IncomingMessage) {
	const url = incomingMessageParseURL(message);
	if(url.search.length) return Object.fromEntries(url.searchParams);

	const body = await incomingMessageReadBody(message);
	return querystring.decode(body);
}

export async function incomingMessageParseToken(message: IncomingMessage) {
	const token = message.headers?.token;
	invariant(token && !Array.isArray(token), 'Invalid token was sent');
	
	return token;
}