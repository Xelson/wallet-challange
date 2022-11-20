import { Worker } from 'node:worker_threads';
import { TransactionRequest } from '~/models/Transaction';

export const workerTransaction = new Worker('./dist/transaction.worker.js');

export function workerTransactionPushRequest(request: TransactionRequest) {
	return new Promise<string>((resolve) => {
		workerTransaction.postMessage(request);
		workerTransaction.once('message', resolve)
	});
}