import * as Express from 'express'
import * as bodyParser from 'body-parser'
import { runCommand } from './runQuery';

const bodyParserLimit = process.env.BODY_PARSER_LIMIT || "50mb"

let start = (app: Express.Express, args) => {
	app.use(bodyParser.json({limit: bodyParserLimit}));
	app.use(bodyParser.urlencoded({limit: bodyParserLimit, extended: true, parameterLimit: 50000}));

	app.post(/sql$/, async (req, res: Express.Response) => {
		const sqlThings = Array.isArray(req.body) ? req.body : [req.body]
		if (process.env.logQueries) {
			console.log(sqlThings)
		}
		if (args["mock"]) {
			res.sendStatus(200)
		} else {
			try {
				for (const sqlSpec of sqlThings) {
					const result = await runCommand(sqlSpec)
				}
				res.sendStatus(200)
			} catch (err) {
				console.error("Error running query", err)
				// Note: the app will shut down on errors on the connection, never reaching here.
				res.sendStatus(501)
			}
		}
	})
}

export default start
