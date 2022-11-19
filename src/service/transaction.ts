import { db } from "~/dbConnection";
import { FromRequest } from "~/httpUtils";
import { Transaction } from "~/models/Transaction";

export async function queryTransactionsGetByToken(token: string, limit: number = 10): Promise<Transaction[]> {
	const [transactions] = await db().query<FromRequest<Transaction>>(
		`SELECT t.id, t.user_id, t.type, t.value FROM wa_transactions t
		INNER JOIN wa_users u ON u.id = t.user_id
		INNER JOIN wa_sessions s ON u.id = s.user_id
		WHERE s.token = ?
		ORDER BY t.id DESC
		LIMIT ?`,
		[token, limit]
	);

	return transactions;
}