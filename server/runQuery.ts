import * as memoize from 'lodash.memoize'
import { Connection, TYPES, Request, ConnectionConfig } from 'tedious';

const config: ConnectionConfig = {
	userName: process.env.username,
	password: process.env.password,
	server: process.env.server || 'sqlservertest',
	options: {
		database: process.env.database || 'XMLTest',
	}
}

const startConnection: () => Promise<Connection> = memoize(async () => {
	const connection = new Connection(config);

	const exitOnFailure = () => {
		console.log("exiting due to lost or failed connection")
		process.exit(1)
	}
	// These are not really necessary, as the application will fail by the unhandled exception anyways.
	connection.on('end', exitOnFailure)
	connection.on('error', exitOnFailure)
	return new Promise((acc, rej) => {
		connection.on('connect', function (err) {
			if (err) {
				console.log(err);
				rej(err)
			} else {
				console.log('Connected');
				acc(connection)
			}
		});
	})
})


export const runCommand = async (cmd: { sql: string, values: { [index: string]: any } }) => {
	const connection = await startConnection()

	const result = new Promise<number>((acc, rej) => {
		const request = new Request(
			cmd.sql,
			(err, rowCount, rows) => {
				if (err) {
					rej(err);
				} else {
					acc(rowCount)
				}
			});
		for (const key of Object.keys(cmd.values)) {
			const value = cmd.values[key]
			// XML type does not work, uses nvvarchar anyways, which fortunately works.
			const sqlServerType = typeof value === "string" ?
				(value.indexOf("<") === 0 ? TYPES.NVarChar : TYPES.NVarChar) : TYPES.Numeric
			request.addParameter(key, sqlServerType, value)
		}

		// Execute SQL statement
		connection.execSql(request);
	})
	return await result
}
