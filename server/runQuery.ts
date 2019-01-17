import { Connection, TYPES, Request } from 'tedious';

export const runCommand = (cmd: { sql: string, params: {[index: string]: any } }) => {
	const config = {
		userName: 'sa', // update me
		password: 'your_password', // update me
		server: 'localhost',
		options: {
			database: 'SampleDB'
		}
	}

	const connection = new Connection(config);

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
			const sqlServerType = typeof value === "string" ?
						(value.indexOf("<") === 0 ? TYPES.Xml : TYPES.NVarChar) : TYPES.Numeric
			request.addParameter(key, sqlServerType, value)
		}

		// Execute SQL statement
		connection.execSql(request);
	})
	return result
}
