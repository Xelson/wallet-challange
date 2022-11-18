import http from 'http';
import config from 'app.config';
import { ApplicationRouter } from './routes';
import { shemaCreateTables } from './shema';

const port = config.httpServer.port
const router = ApplicationRouter;

const server = http.createServer(router.middleware);
shemaCreateTables();

server.listen(port, () => {
	console.log(`Wallet Challange application is running on http://localhost:${port}`);
});