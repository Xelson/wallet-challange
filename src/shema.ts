import { db } from "./dbConnection";

export async function shemaCreateTables() {
	await db().query(`
		CREATE TABLE IF NOT EXISTS wa_roles (
			id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,

			balance_read BOOLEAN DEFAULT 0,
			transactions_read BOOLEAN DEFAULT 0,
			transactions_insert BOOLEAN DEFAULT 0
		);
	`);

	await db().query(`
		CREATE TABLE IF NOT EXISTS wa_users (
			id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
			role_id INT NOT NULL,
			balance INT DEFAULT 0,

			username VARCHAR(64) NOT NULL UNIQUE,
			password VARCHAR(64) NOT NULL,

			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

			FOREIGN KEY (role_id) REFERENCES wa_roles(id)
		);
	`);

	await db().query(`
		CREATE TABLE IF NOT EXISTS wa_sessions (
			token VARCHAR(36) PRIMARY KEY NOT NULL,
			user_id INT NOT NULL,
			expires_in DATETIME NOT NULL,

			FOREIGN KEY (user_id) REFERENCES wa_users(id) ON DELETE CASCADE
		);
	`);

	await db().query(`
		CREATE TABLE IF NOT EXISTS wa_transactions (
			id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
			user_id INT NOT NULL,
			type TINYINT NOT NULL,
			value INT NOT NULL,

			FOREIGN KEY (user_id) REFERENCES wa_users(id) ON DELETE CASCADE
		);
	`);

	await db().query(`
		INSERT IGNORE INTO wa_roles (id, balance_read, transactions_read, transactions_insert) 
		VALUES
			(1, 0, 0, 0),
			(2, 1, 0, 0),
			(3, 1, 1, 0),
			(4, 1, 1, 1);
	`);

	await db().query(`
		INSERT IGNORE INTO wa_users (username, password, role_id, balance) 
		VALUES 
			('admin', SHA2('admin', 256), 4, 0)
	`);
}