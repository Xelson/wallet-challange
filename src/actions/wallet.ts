import { db } from "~/dbConnection";
import { FromRequest } from "~/httpUtils";
import { invariant } from "~/invariant";
import { TransactionType } from "~/models/Transaction";
import { queryTransactionsGetByToken } from "~/service/transaction";
import { queryUserFindByTokenWithPermissions } from "~/service/user";
import { actionSessionValidateAndExtend } from "./auth";

export async function actionWalletGetTransactions(token: string, limit: number = 10) {
	await actionSessionValidateAndExtend(token);

	const user = await queryUserFindByTokenWithPermissions(token);
	invariant(user && user.transactions_read, 'You have no access to this action');

	const transactions = await queryTransactionsGetByToken(token, limit);
	return transactions;
}

export async function actionWalletExecuteTransaction(token: string, type: TransactionType, value: number) {
	await actionSessionValidateAndExtend(token);

	const user = await queryUserFindByTokenWithPermissions(token);
	invariant(user && user.transactions_insert, 'You have no access to this action');

	const connection = await db().getConnection();
	connection.beginTransaction();

	switch(type) {
		case TransactionType.deposit:
			try {
				await connection.query('UPDATE wa_users SET balance = balance + ? WHERE id', [value, user.id]);
				await connection.query(
					'INSERT INTO wa_transactions (user_id, type, value) VALUES (?, ?, ?)',
					[user.id, type, value]
				);

				await connection.commit();
				connection.release();
			}
			catch (error) {
				await connection.rollback();
				connection.release();

				throw error;
			}

			break;

		case TransactionType.withdraw:
			try {
				const [rows] = await connection.query<FromRequest<{balance: number}>>(
					'SELECT balance FROM wa_users WHERE id = ?', [user.id]
				)

				const balance = rows[0].balance;
				invariant(balance >= value, 'Balance is not enough');

				await connection.query('UPDATE wa_users SET balance = balance - ? WHERE id = ?', [value, user.id]);
				await connection.query(
					'INSERT INTO wa_transactions (user_id, type, value) VALUES (?, ?, ?)',
					[user.id, type, value]
				);

				await connection.commit();
				connection.release();
			}
			catch (error) {
				await connection.rollback();
				connection.release();

				throw error;
			}
			connection.release();

			break;
	}
}