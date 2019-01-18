import { Connection, TYPES, Request, ConnectionConfig } from 'tedious';
import { ETIME } from 'constants';
import { exists } from 'fs';

const config: ConnectionConfig = {
	userName: process.env.username,
	password: process.env.password,
	server: process.env.server || 'sqlservertest',
	options: {
		database: process.env.database || 'XMLTest',
	}
}

const connection = new Connection(config);

connection.on('connect', function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected');
	}
});

const exitOnFailure = () => {
	console.log("exiting due to lost or failed connection")
	process.exit(1)
}
// These are not really necessary, as the application will fail by the unhandled exception anyways.
connection.on('end', exitOnFailure)
connection.on('error', exitOnFailure)


export const runCommand = (cmd: { sql: string, params: { [index: string]: any } }) => {


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
		for (const key of Object.keys(cmd.params)) {
			const value = cmd.params[key]
			// XML type does not work, uses nvvarchar anyways, which fortunately works.
			const sqlServerType = typeof value === "string" ?
				(value.indexOf("<") === 0 ? TYPES.NVarChar : TYPES.NVarChar) : TYPES.Numeric
			request.addParameter(key, sqlServerType, value)
		}

		// Execute SQL statement
		connection.execSql(request);
	})
	return result
}
