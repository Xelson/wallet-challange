
export enum TransactionType {
	deposit,
	withdraw
}

export interface Transaction {
	id: number,
	user_id: number,
	type: TransactionType,
	value: number
}