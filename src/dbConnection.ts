import mysql, { RowDataPacket } from 'mysql2'
import config from 'app.config';

const pool = mysql.createPool({
	host: config.mysql.host,
	user: config.mysql.user,
	password: config.mysql.password,
	database: config.mysql.database,
	connectionLimit: 5
});

export const db = () => pool.promise();