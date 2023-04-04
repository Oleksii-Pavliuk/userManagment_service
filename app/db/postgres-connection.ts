import pg, { Pool, QueryResult } from "pg";

import config from "../config/config";

const pool: Pool = new pg.Pool({
	user: config.get("pguser"),
	host: config.get("pghost"),
	database: config.get("pgdatabase"),
	password: config.get("pgpassword"),
	port: config.get("pgport"),
});

pool.on("error", (err) => {
	console.error("Error postgres: ", err);
});

// This method not to be used with transactions that span
// multiple statements.
// See https://node-postgres.com/features/transactions
// use ruInTransaction provided by this module
export const postgreQuery = (
	text: string,
	params: any[]
): Promise<QueryResult> => {
	return pool.query(text, params);
};

export const postgreTransaction = async (
	queryFn: (client: pg.PoolClient) => Promise<void>
): Promise<void> => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		await queryFn(client);
		client.query("COMMIT");
	} catch (e) {
		await client.query("ROLLBACK");
		throw e;
	} finally {
		client.release();
	}
};
