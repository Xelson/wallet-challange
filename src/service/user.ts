import { db } from "~/dbConnection";
import { FromRequest } from "~/httpUtils";
import { User } from "~/models/User";

export async function queryUserFindByCredentials(username: string, password: string): Promise<User | undefined> {
	const [user] = await db().query<FromRequest<User>>(
		'SELECT * FROM wa_users WHERE username = ? AND password = SHA2(?, 256)', 
		[username, password]
	);
	
	return user[0];
}