import { 
	querySessionCreate, 
	querySessionDeleteByToken, 
	querySessionExtendByToken, 
	querySessionFindByToken, 
	querySessionValidateByToken
} from "~/service/session";

import { invariant } from "~/invariant";
import { queryUserFindByCredentials } from "~/service/user";

export async function actionUserLogin(username: string, password: string): Promise<string> {
	const user = await queryUserFindByCredentials(username, password);
	invariant(user, 'Invalid login or password');

	const token = await querySessionCreate(user.id);
	return token;
}

export async function actionUserLogout(token: string) {
	const session = await querySessionFindByToken(token);
	invariant(session, 'Invalid session');

	await querySessionDeleteByToken(session.token);
}

export async function actionSessionValidateAndExtend(token: string) {
	const isInvalid = await querySessionValidateByToken(token);
	invariant(!isInvalid, 'This session is invalid or expired');
	
	await querySessionExtendByToken(token);
}