import { Role } from "./Role"

export interface User {
	id: number,
	username: string,
	password: string,
	
	role_id: number,
	balance: number
}

export type UserWithPermissions = Exclude<User, 'password' | 'role_id'> & Exclude<Role, 'id'>