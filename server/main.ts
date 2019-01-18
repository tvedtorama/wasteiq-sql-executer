import * as Express from 'express'
import * as bodyParser from 'body-parser'
import { runCommand } from './runQuery';

const bodyParserLimit = process.env.BODY_PARSER_LIMIT || "50mb"

let start = (app: Express.Express, args) => {
	app.use(bodyParser.json({limit: bodyParserLimit}));
	app.use(bodyParser.urlencoded({limit: bodyParserLimit, extended: true, parameterLimit: 50000}));

	app.post(/sql$/, async (req, res: Express.Response) => {
		console.log(req.body)
		if (args["mock"]) {
			res.sendStatus(200)
		} else {
			try {
				const result = await runCommand(req.body)
				res.sendStatus(200)
			} catch (err) {
				// Note: the app will shut down on errors on the connection, never reaching here.
				res.sendStatus(501)
			}
		}
	})
}

export default start
