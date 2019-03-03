require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')

const {ArgumentParser} = require('argparse');
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argparse example'
});
parser.addArgument(
	[ '-m', '--mock' ],
	{
		help: "Just print the sql, don't execute",
		action: "storeTrue",
		nargs: 0,
	});
	
	
const args = parser.parseArgs()
		
const app = express()

const serverApp = process.env["serverApp"] || "adminGUIServer"

app.disable('x-powered-by');
app.use(cookieParser())

const main = require(`./build/${serverApp}/main`)

main.default(app, args)

const port = parseInt(process.env["port"] || "3000")

app.listen(port, function (err, result) {
	if (err) {
	return console.log(err);
	}

	console.log(`Listening at http://*:${port}/`);
});	

