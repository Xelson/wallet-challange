import { 
	incomingMessageParseQueryString, 
	incomingMessageParseToken 
} from "./httpUtils";

import { Router } from "./router";
import { invariant } from "./invariant";
import { actionUserLogin, actionUserLogout } from "./actions/auth";
import { actionGetUserBalanceByToken } from "./actions/user";
import { actionWalletExecuteTransaction, actionWalletGetTransactions } from "./actions/wallet";
import { TransactionType } from "./models/Transaction";

export const ApplicationRouter = new Router();

ApplicationRouter
	.post('/auth/login', async (req, res) => {
		const query = await incomingMessageParseQueryString(req);

		const { username, password } = query;
		invariant(username && password && !Array.isArray(username) && !Array.isArray(password), 'Malformed authorization request');

		const token = await actionUserLogin(username, password);

		res.write(`Token: ${token}`);
	})
	.post('/auth/logout', async (req, res) => {
		const token = await incomingMessageParseToken(req);
		await actionUserLogout(token);
		
		res.write('Current session is was deactivated');
	})

ApplicationRouter
	.get('/users/balance', async (req, res) => {
		const token = await incomingMessageParseToken(req);
		const balance = await actionGetUserBalanceByToken(token);

		res.write(balance.toString());
	})

ApplicationRouter
	.get('/wallet/list', async (req, res) => {
		const token = await incomingMessageParseToken(req);
		const query = await incomingMessageParseQueryString(req);

		const limit = Number(query?.limit) || 10;
		const transactions = await actionWalletGetTransactions(token, limit);

		res.write(JSON.stringify(transactions));
	})
	.post('/wallet/deposit', async (req, res) => {
		const token = await incomingMessageParseToken(req);
		const query = await incomingMessageParseQueryString(req);

		const value = Number(query.value);
		invariant(!isNaN(value), 'Invalid "value" paramater');

		await actionWalletExecuteTransaction(token, TransactionType.deposit, value);
	})
	.post('/wallet/withdraw', async (req, res) => {
		const token = await incomingMessageParseToken(req);
		const query = await incomingMessageParseQueryString(req);

		const value = Number(query.value);
		invariant(!isNaN(value), 'Invalid "value" paramater');

		await actionWalletExecuteTransaction(token, TransactionType.withdraw, value);
	})