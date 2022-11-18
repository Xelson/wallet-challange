
export interface AccessToken {
	token: string,
	expires_in: string
}

export interface Session extends AccessToken {
	user_id: number,
}