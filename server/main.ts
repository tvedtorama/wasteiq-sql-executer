import * as Express from 'express'
import * as bodyParser from 'body-parser'
import { runCommand } from './runQuery';

const bodyParserLimit = process.env.BODY_PARSER_LIMIT || "50mb"

let start = (app: Express.Express) => {
	app.use(bodyParser.json({limit: bodyParserLimit}));
	app.use(bodyParser.urlencoded({limit: bodyParserLimit, extended: true, parameterLimit: 50000}));

	app.post(/sql$/, async (req, res: Express.Response) => {
		console.log(req.body)
		const result = await runCommand(req.body)
		res.sendStatus(200)
	})
}

export default start
