# wasteiq-sql-executer

## Running
```npm start```

The `start` script builds and runs with source map support, not secessary in production - probably. 


## Configuration

You can use a .env file for development.

server=10.211.55.6
username=sa
password=SiberianZummer78
database=wasteiq



## SQL Server in Docker

`sudo docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=[PWD]'  -p 1433:1433 --name sqldocker -d mcr.microsoft.com/mssql/server:2017-latest`

If the docker falls away immediately, you most likely have choosen a too weak pwd.  You might not see anything in the logs, but if you restart the failed docker - you might see something.

