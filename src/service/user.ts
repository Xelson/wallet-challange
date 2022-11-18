import { db } from "~/dbConnection";
import { FromRequest } from "~/httpUtils";
import { User, UserWithPermissions } from "~/models/User";

export async function queryUserFindByCredentials(username: string, password: string): Promise<User | undefined> {
	const [user] = await db().query<FromRequest<User>>(
		'SELECT * FROM wa_users WHERE username = ? AND password = SHA2(?, 256)', 
		[username, password]
	);
	
	return user[0];
}

export async function queryUserFindByTokenWithPermissions(token: string): Promise<UserWithPermissions | undefined> {
	const [user] = await db().query<FromRequest<UserWithPermissions>>(
		`SELECT u.id, u.username, u.balance, r.balance_read, r.transactions_read, r.transactions_insert 
		FROM wa_users u
		INNER JOIN wa_sessions s ON u.id = s.user_id
		INNER JOIN wa_roles r ON u.role_id = r.id
		WHERE s.token = ?`,
		[token]
	);

	return user[0];
}