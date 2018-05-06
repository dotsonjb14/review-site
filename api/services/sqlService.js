const secrets = require("../config/secrets")

class sqlService
{
    async executeQuery(queryString, params) {
        const { Client } = require('pg')
        const client = new Client(secrets.sqlSettings)

        await client.connect()

        let results = await client.query(queryString, params);

        await client.end();

        return results;
    }
}

module.exports = sqlService;
