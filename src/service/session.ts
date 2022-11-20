import { Session } from "~/models/Session";
import { db } from "~/dbConnection";
import { v4 as uuidv4 } from 'uuid';
import { FromRequest } from "~/httpUtils";
import parseDuration from 'parse-duration';
import config from 'app.config';

const sessionLifeTime = parseDuration(config.session.expire_time, 'hour');

export async function querySessionCreate(user_id: number): Promise<string> {
	const token = uuidv4()

	await db().query<FromRequest<Session>>(
		'INSERT INTO wa_sessions (token, user_id, expires_in) VALUES (?, ?, CURRENT_TIMESTAMP + INTERVAL ? HOUR)', 
		[token, user_id, sessionLifeTime]
	);
	return token
}

export async function querySessionFindByToken(token: string): Promise<Session | undefined> {
	const [session] = await db().query<FromRequest<Session>>(
		'SELECT * FROM wa_sessions WHERE token = ?', 
		[token]
	);
	return session[0];
}

export async function querySessionDeleteByToken(token: string) {
	await db().query('DELETE FROM wa_sessions WHERE token = ?', [token]);
}

export async function querySessionExtendByToken(token: string) {
	await db().query('UPDATE wa_sessions SET expires_in = CURRENT_TIMESTAMP + INTERVAL ? HOUR WHERE token = ?', [sessionLifeTime, token]);
}

export async function querySessionValidateByToken(token: string): Promise<boolean> {
	const [result] = await db().query<FromRequest<{invalid: boolean}>>(
		'SELECT CURRENT_TIMESTAMP > expires_in as invalid FROM wa_sessions WHERE token = ?', 
		[token]
	);
	return !result[0] || result[0].invalid;
}