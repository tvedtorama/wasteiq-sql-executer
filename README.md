# wasteiq-sql-executer

## Running
```npm start```

The `start` script builds and runs with source map support, not necessary in production - probably. 


## Configuration

You can use a .env file for development:

Something like this:
```
server=10.211.55.6
username=sa
password=SiberianZummer78
database=wasteiq
```

Attempting to put password in command line envs will most likely fail, at least if it contains "special" characters.

## SQL Server in Docker

`sudo docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=[PWD]'  -p 1433:1433 --name sqldocker -d mcr.microsoft.com/mssql/server:2017-latest`

If the docker falls away immediately, you most likely have choosen a too weak pwd.  You might not see anything in the logs, but if you restart the failed docker - you might see something.

## Running a test query

In bash:

```
curl -X POST 'http://localhost:3999/sql' -d '{"sql": "INSERT INTO Operator (operatorId, name) VALUES ('\''234'\'', '\''hei'\'')", "values": []}' -H "Content-Type: application/json"
```
