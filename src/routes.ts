import { 
	incomingMessageParseQueryString, 
	incomingMessageParseToken 
} from "./httpUtils";

import { Router } from "./router";
import { invariant } from "./invariant";
import { actionUserLogin, actionUserLogout } from "./actions/auth";
import { actionGetUserBalanceByToken } from "./actions/user";

export const ApplicationRouter = new Router();

ApplicationRouter
	.post('/auth/login', async (req, res) => {
		const query = await incomingMessageParseQueryString(req);

		const { username, password } = query;
		invariant(username && password && !Array.isArray(username) && !Array.isArray(password), 'Malformed authorization request');

		const token = await actionUserLogin(username, password);

		res.write(`Token: ${token}`);
		res.end();
	})
	.post('/auth/logout', async (req, res) => {
		const token = await incomingMessageParseToken(req);
		await actionUserLogout(token);
		
		res.write('Current session is was deactivated');
		res.end();
	})
	.get('/users/balance', async (req, res) => {
		const token = await incomingMessageParseToken(req);
		const balance = await actionGetUserBalanceByToken(token);

		res.write(balance.toString());
		res.end();
	})