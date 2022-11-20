import { parentPort, isMainThread } from 'node:worker_threads';
import { actionWalletExecuteTransaction } from '~/actions/wallet';
import { TransactionRequest } from '~/models/Transaction';

if(!isMainThread && parentPort) {
	const requestsQueue: TransactionRequest[] = [];

	parentPort.on('message', request => {
		requestsQueue.push(request);
	});

	async function executeRequest(request: TransactionRequest) {
		if(parentPort) {
			try	{
				await actionWalletExecuteTransaction(request.token, request.type, request.value);
				parentPort.postMessage('ok');
			}
			catch (e) {
				parentPort.postMessage(e.message);
			}
		}
	}

	async function executeRequestsFromQueue() {
		while(requestsQueue.length) {
			const request = requestsQueue.shift();
			if(!request) break;
			await executeRequest(request);
		}
		setTimeout(executeRequestsFromQueue, 10);
	}

	executeRequestsFromQueue();
}