# wallet-challange

Starting the web-server:

1. Creating a your own configuration file `app.config.js` using `app.config.example.js`

2. Executing the following commands:
```
npm install
npm run build
npm run serve
```

Creditionals for the default `admin` user with full access:
* login: `admin`
* password: `admin`

## A few points about the solution:
* [esbuild](https://esbuild.github.io) and [gulp](https://gulpjs.com) is used for building workflow;
* when initializing the database schema, 4 basic roles are generated, starting from having no access **(1)** and ending with a role with full access to all endpoints **(4)**;
* [UUID v4](https://www.rfc-editor.org/rfc/rfc4122.html) is used to generate tokens for sessions;
* `Token` HTTP header is used to transmit the session token. Request parameters are accepted in query string format both in URL or in request body.
* `/wallet/deposit` and `/wallet/withdraw` endpoints use a separate worker-thread queue for all request to increase fault tolerance on heavy transaction load. Also these actions use [mysql transactions](https://dev.mysql.com/doc/refman/8.0/en/commit.html) to execute an atomic sequence of queries to solve concurrency problems
