import { invariant } from "~/invariant";
import { queryUserFindByTokenWithPermissions } from "~/service/user";
import { actionSessionValidateAndExtend } from "./auth";

export async function actionGetUserBalanceByToken(token: string): Promise<number> {
	await actionSessionValidateAndExtend(token);

	const user = await queryUserFindByTokenWithPermissions(token);
	invariant(user && user.balance_read, 'You have no access to this action');

	return user.balance;
}